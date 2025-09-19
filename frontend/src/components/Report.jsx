import React from 'react'
import { Row, Col, Card, Upload, Button, Typography, message } from 'antd'
import { InboxOutlined, DownloadOutlined, FileDoneOutlined } from '@ant-design/icons'

const { Dragger } = Upload
const { Title } = Typography




function Report({ elc, county, year, elcOptions, ALL, onComplete }) {
  const [uploadRefD, setUploadRefD] = React.useState(null)
  const [uploadRefE, setUploadRefE] = React.useState(null)

  // for the dragger box and sets up the configs for it for upload
  const makeProps = (section, setRef) => ({
    name: 'insert',
    action: `/api/upload`,
    data: { elc, year, county },
    accept: 'application/pdf',
    maxCount: 1,
    onChange(info) {
      if (info.file.status === 'done') {
        const ref = info.file.response?.upload_ref
        setRef(ref)
        message.success(`${section} uploaded`)
      } else if (info.file.status === 'error') {
        message.error(`${section} upload failed`)
      }
    },
  })

     
  const handleMerge = async () => {
    try {
      //figures out counties payload
      const selectedElc = elcOptions.find(o => o.value === elc);
      const isAll = county === ALL;
      const counties = isAll && selectedElc ? selectedElc.counties.map(c => c.value) : undefined;
  
      const body = {
        elc,
        year,
        sections: ['A', 'B', 'C'],
        uploadRef: uploadRefD || undefined,
        uploadRef2: uploadRefE || undefined,

        //sends a single county or a list of counties
        county: !isAll ? county : undefined,

        counties,
      };

      //start the merge function 
      const res = await fetch(`/api/merge`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      });
  
      //check for errors in the backend
      if (!res.ok) {
        let errMsg = `Merge failed (${res.status})`;
        try {
          const err = await res.json();
          if (err?.error) errMsg = err.error;
        } catch {}
        message.error(errMsg);
        return;
      }
  
      const blob = await res.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `${elc}_${year}_CNA_Report.pdf`;
      a.click();
      window.URL.revokeObjectURL(url);
      onComplete?.();

      
    } catch (err) {
      console.error(err);
      message.error('Merge failed');
    }
  };
  

  return (
    <div className="StepBody">
      <div className="StepContent">
        <div style={{ marginTop: 16 }}>
          {/* pseudo button for Segment E template */}
          <Button icon={<FileDoneOutlined />} href="#" target="_blank">
            Download Segment E Template
          </Button>
        </div>

        
      {/* segment D Card  */}
        <Row gutter={[16, 16]}>
          <Col xs={24} md={12}>
            <Card style={{ minHeight: '500px', display: 'flex', flexDirection: 'column' }}>
              <Title level={5}>Segment D — Community Resources</Title>
              <Dragger {...makeProps('D', setUploadRefD)} style={{ height: '800px' }}>
                <p className="ant-upload-drag-icon"><InboxOutlined /></p>
                <p>Click or drag PDF here</p>
              </Dragger>
            </Card>
          </Col>

          {/* segment E Card  */}
          <Col xs={24} md={12}>
            <Card style={{ minHeight: '500px', display: 'flex', flexDirection: 'column' }}>
              <Title level={5}>Segment E — Summary & Priorities</Title>
              <Dragger {...makeProps('E', setUploadRefE)}>
                <p className="ant-upload-drag-icon"><InboxOutlined /></p>
                <p>Click or drag PDF here</p>
              </Dragger>
            </Card>
          </Col>
        </Row>

        <div style={{ marginTop: 16 }}>
          <Button
            type="primary"
            icon={<DownloadOutlined />}
            onClick={handleMerge}
            disabled={!uploadRefD && !uploadRefE}
          >
            Download Report
          </Button>
        </div>

        
      </div>
    </div>
  )
}
export default Report