import os,uuid ,time

# base directory for each path of the files
BASE_DIR =  os.path.abspath(os.path.dirname(__file__))

#root for files stored by elcs 
FILES_ROOT = os.path.join(BASE_DIR,"private_files")

#root for the temp files being stored and deleted
TEMP_ROOT = os.path.join(BASE_DIR,"temp")


TEMP_UPLOADS = os.path.join(TEMP_ROOT, 'uploads')
ALLOWED_TYPES =["application/pdf"]
os.makedirs(TEMP_UPLOADS, exist_ok=True)



ALLOWED_YEARS = [2025] # will add more years as they progress
MAX_UPLOAD_MB = 25
TEMP_UPLOAD_TIME = 10 # 5 minutes 


# identififaction used when called by api/ frontend
SECTION_KEYS = ['A', 'B', 'C']
SECTION_LABELS = {
    'A': 'Report Part A',
    'B': 'Report Part B',
    'C': 'Report Part C'
}

ELC_INDEX = {
    'AlachuaELC': {'type': 'single', 'counties':['Alachua']},
    'FloridaGatewayELC': {'type': 'multi', 'counties':['Hamilton', 'Lafayette', 'Suwannee', 'Columbia', 'Union']}
    #28 more to go.... :(
}

#returns  the file name that matches description
#can use to change all the file names later
def filename_for(section_key:str, county:str) -> str:
    return f"ELC_{county}_report_{section_key}.pdf"



#builds the abs path from the elc index
def build_path(year:int, elc:str, county:str, section_key:str) -> str:
    entry = ELC_INDEX[elc]
    fname = filename_for(section_key, county)
    if entry["type"] == "single":
        return os.path.join(FILES_ROOT, str(year), county, fname)
    return os.path.join(FILES_ROOT, str(year), elc, county, fname)

#abs path for a filename thats in index
def path_from_filename(filename:str) -> str:
    return os.path.join(FILES_ROOT, filename)

def new_upload_name() -> str:
    return f'{uuid.uuid4().hex}.pdf'

def uploads_dir() -> str:
    return TEMP_UPLOADS



#deletes temp uploads older than temp time just in case
def cleanup_uploads():
    ttl = TEMP_UPLOAD_TIME or 0
    if ttl <= 0:
        return
    else:
        updir = uploads_dir()
        now = time.time()
        
        if not os.path.exists(updir):
            return
        else:
            for name in os.listdir(updir):
                path = os.path.join(updir, name)
                if not os.path.isfile(path):
                    continue
                try:
                    if now - os.path.getmtime(path) > ttl:
                        os.remove(path)
                except OSError:
                    continue