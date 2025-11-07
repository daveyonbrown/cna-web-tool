from flask import Flask, jsonify, send_file, request
from flask_cors import CORS 
from io import BytesIO
from pypdf import PdfWriter
import config 
import os, config, time


app = Flask(__name__)
CORS(app)
app.config.from_object(config)



@app.route('/')
def home():
    return 'Hi I am working!!!'


#checks status of routes
@app.route('/status', methods=['GET'])
def status_check():
    return jsonify({'ok': True, 'files_root': app.config['FILES_ROOT']})


#list out the elcs available from ELC_Index
@app.route('/api/elcs', methods=['GET'])
def get_elcs():
    items = []
    for name, meta in config.ELC_INDEX.items():
        items.append({
            'name': name,
            'type': meta['type'],
            'counties': meta['counties']
        })
    return jsonify({'ELCs': items})




#lists the files for a ELC using year,index and section key
@app.route('/api/files', methods=['GET'])
def get_files():
    year = int(request.args.get('year',config.ALLOWED_YEARS[0]))
    elc = request.args.get('elc')
    county = request.args.get('county')

    if not elc or not year or not county:
        return jsonify({'message':'You must include a valid elc, year, and county'}),400
    if elc not in config.ELC_INDEX:
        return jsonify({'error': f'Unknown ELC: {elc}'}), 404
    if int(year) not in config.ALLOWED_YEARS:
        return jsonify({'error': f'Year not allowed: {year}'}), 404
    if county not in config.ELC_INDEX[elc]['counties']:
        return jsonify({'error': f"County '{county}' not in {elc}"}), 404

    print("FILES params ->", year, elc, county)
    files = []
    for key in config.SECTION_KEYS:
        path = config.build_path(year, elc, county, key)
        print(f"Checking section {key} -> {path}")
        files.append({
            'section': key,
            'label': config.SECTION_LABELS.get(key,f'Missing label for {key}'),
            'filename':os.path.basename(path),
            'exists':os.path.exists(path)
        })

    return jsonify({
        'year':year, 'elc':elc, 'county':county, 'sections':files
    })



@app.route('/api/preview', methods=['GET'])
def get_preview():
    year = int(request.args['year'])
    elc = request.args['elc']
    county = request.args['county']
    section = request.args['section']
    classThres =request.args.get('classThres')

    all_section = config.c_section(section,classThres)
    path = config.build_path(year,elc,county,all_section)
    print("Attempting preview path:", path)
    if not os.path.exists(path):
        return jsonify({'message':'preivew is does not exist'})
    
    return send_file(path,mimetype='application/pdf')



@app.route('/api/download', methods=['GET'])
def download():
    year = int(request.args['year'])
    elc = request.args['elc']
    county = request.args['county']
    section = request.args['section']
    classThres =request.args.get('classThres')
    

    all_section = config.c_section(section,classThres)
    path = config.build_path(year,elc,county,all_section)
    print("Attempting preview path:", path)
    if not os.path.exists(path):
        return jsonify({'message':' file does not exist'})
    
    download_name = f'{county}_{year}_CNA_{section}.pdf'
    return send_file(path,as_attachment=True, download_name=download_name)




@app.route('/api/upload', methods=['POST'])
def upload():

    #intializes the form fields to check and see if data is valid 
    elc = request.form.get('elc')
    year = request.form.get('year')
    county = request.form.get('county')
    file = request.files.get('insert')

    if not(elc and year and county and file):
        return jsonify({'error': 'Missing elc, year, county, or file field'})
    
    if file.mimetype not in  config.ALLOWED_TYPES:
        return jsonify ({'error': 'Only PDFs allowed'})
    

    #checks to see if the file size is too big
   
    file.seek(0, os.SEEK_END)
    size_bytes = file.tell()
    file.seek(0)

    if config.MAX_UPLOAD_MB and size_bytes > config.MAX_UPLOAD_MB * 1024 *1024:
        return jsonify({'error': 'File too large'})
        
    head = file.stream.read(5)
    file.stream.seek(0)
    if head != config.PDF_MAGIC:
        if file.mimetype not in config.ALLOWED_TYPES:
            return jsonify({'error': 'Only PDF files are allowed'})


    #sets the new upload name with a uuid and where to upload in its path
    upload_name = config.new_upload_name()
    dest_path = os.path.join(config.uploads_dir(),upload_name)

    try:
        file.save(dest_path)
    except Exception as e:
        return jsonify({'error': f'File cannot be saved: {e}'})
    
     #deletes old uploads 
    try:
        config.cleanup_uploads()
    except Exception:
        pass

    return jsonify({
        'ok': True,
        'upload_ref': upload_name,
        'size': size_bytes,
        'recievedAt': int(time.time()),
        'expire_time': getattr(config,'TEMP_UPLOAD_TIME', None)
    }), 201


@app.route('/api/merge', methods=['POST'])
def merge():
    

     #deletes old uploads 
    try:
        config.cleanup_uploads()
    except Exception:
        pass

    #intializes the data and checks if itd valid
    data = request.get_json(silent=True) or {} 
    elc = data.get('elc')
    year = data.get('year')
    county = data.get('county')
    sections = data.get('sections') or []
    classThres = data.get('classThres')
    upload_ref = data.get('uploadRef')
    upload_ref2 = data.get('uploadRef2')
    counties = data.get('counties')

    if not all([elc,year]):
        return jsonify({'error': 'missing feild for merger'})
    
    try:
        year = int(year)
    except Exception:
        return jsonify({'error': 'year must be an integer'})
    
    if elc not in config.ELC_INDEX:
        return jsonify({'error': 'invalid elc'})


    if isinstance(counties, list) and counties:
         selected_counties = counties
    elif county:
        
        selected_counties = [county]
    else:
        return jsonify({'error': 'no counties selected'})
        
    
    

    

    #intializes the pdf write function for merging
    writer = PdfWriter()
    
    merge_files = []


    #starts the merge process and adds in the base files into the merger 
    for cty in selected_counties:
        for section in sections:
            all_section = config.c_section(section,classThres)
            section_path = config.build_path(year,elc,cty, all_section)
            if not os.path.exists(section_path):
                return jsonify({'error': 'no pdfs found for section'})
            merge_files.append(section_path)
    
    #now adds the uploaded files 
    insert_streams= []
    for ref in [upload_ref,upload_ref2]:
        if ref:
            path = os.path.join(config.uploads_dir(),ref)
            if not os.path.exists(path):
                return jsonify({'error': 'no file found'})
            
            #starts to read into memory and delete uploads from disk once merge completes
            with open(path,'rb') as file:
                data = file.read()

            if os.path.exists(path):
                os.remove(path)

            insert_streams.append(BytesIO(data))

    
    try:
        #these are the base files to make sure they stay in order 
        for pdf in merge_files:
            print("adding base:", pdf)
            writer.append(pdf)
            
        #adds the uploaded files to merger
        #this inserts the uploaded files at the end of the report
        for stream in insert_streams:
            print("adding upload:", stream)
            stream.seek(0)
            writer.append(fileobj=stream)


        #writes it into memory 
        output_buffer = BytesIO()
        writer.write(output_buffer)
        writer.close()
        output_buffer.seek(0)

        filename = f'{elc}_{year}_CNA_Report.pdf'
        return send_file(output_buffer,mimetype='application/pdf',as_attachment=True, download_name=filename)

    except Exception as e:
        return jsonify ({'error': f'merge failed: {e}'})
    
    finally:
        pass


    





if __name__ == "__main__":
    app.run(debug=True)


