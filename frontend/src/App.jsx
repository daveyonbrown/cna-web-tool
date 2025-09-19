import React from 'react'
import './App.css'
import { Layout, Typography, Space, Steps, Button, Modal} from 'antd'
import { InfoCircleOutlined } from '@ant-design/icons';

import Start from './components/Start'
import Selector from './components/Selector'
import Review from './components/Review'
import Report from './components/Report'
import Complete from './components/Complete';


const { Header, Footer, Content } = Layout
const { Title, Text, Paragraph } = Typography


//all elcs will be stored here 
const elcOptions = [
  {
    value: 'AlachuaELC',
    label: 'ELC of Alachua',
    type: 'single',
    counties: [{ value: 'Alachua', label: 'Alachua' }]
  },

  {
    value: 'FloridaGatewayELC',
    label: "ELC of Florida's Gateway",
    type: 'multi',
    counties: [
      { value: 'Hamilton', label: 'Hamilton' },
      { value: 'Lafayette', label: 'Lafayette' },
      { value: 'Suwannee', label: 'Suwannee' },
      { value: 'Columbia', label: 'Columbia' },
      { value: 'Union', label: 'Union' },
    ]
  }

]

//value used when all elc selects multi counties
const allCountiesVal = 'ALL';

function App() {

  const [elc, setElc] = React.useState();
  const [county, setCounty] = React.useState();
  const [current, setCurrent] = React.useState(0);
  const thisYear = new Date().getFullYear();
  const[ year, setYear] = React.useState(thisYear);
  const [confirmElc, setConfirmElc] = React.useState(false);
  const [helpOpen, setHelpOpen] = React.useState(false);

  //used for buttons to proceed through the steps
  const next = () => setCurrent((curr) => Math.min(curr + 1, 4));
  const prev = () => setCurrent((curr) => Math.max(curr- 1, 0));

  //titles for the progress bar
  const items = [
    {title: 'Start'},
    {title: 'Select ELC'},
    {title: 'Review Documents'},
    {title: 'Submit Report'},
    {title: 'Complete'}
  ]

  //this makes it so the user cannot go on until ELC is selected
  const goNextBut = current !== 1 ? true : Boolean(elc && confirmElc);

  const goComplete = () => setCurrent(4);
  
  const restart = () => {
    setElc(undefined);
    setCounty(undefined);
    setYear(thisYear);
    setConfirmElc(false);
    setCurrent(0);
  };

  const [classThres, setClassThres] = React.useState(4.5);

  return (
    <div className='App'>
    <Layout className='LayoutFull' >
      <Header className='HeaderStyle' >Community Needs Assessment</Header>
      
      <Content className='ContentStyle' >
      <div className='StepsWrap'>
        <div className='StepsBar'>
          <Steps current={current} items={items} />
        </div>
        <div className='StepBody'>
          <div className='StepContent' > 

            {/* step 1 Start  */}
            {current == 0 && (<Start onNext={next} /> )}


            {/* step 2 Select ELC  */}
            {current == 1 && (
              <Selector
                elc={elc}
                setElc={setElc}
                county={county}
                setCounty={setCounty}
                year={year}
                setYear={setYear}
                elcOptions={elcOptions}
                allCountiesVal={allCountiesVal}
                confirmElc={confirmElc}
                setConfirmElc={setConfirmElc}
                classThres={classThres}
                setClassThres={setClassThres}
              />
            )}



            

            {/* step 3 Reveiw Docs */}
            {current == 2 && (
              <Review 
                elc = {elc}
                county = {county}
                year = {year}
                elcOptions = {elcOptions}
                ALL = {allCountiesVal}
                classThres= {classThres}
              /> 
            )}

            {/* step 4 download  */}
            {current == 3 && (
              <Report 
                elc = {elc}
                county = {county}
                year = {year}
                elcOptions = {elcOptions}
                ALL = {allCountiesVal}
                classThres = {classThres}
                onComplete={goComplete}
              /> 
            )}
          
            {/* step 5 complete */}
            {current == 4 && (
              <Complete
              onNext={restart}
              elc = {elc}
                county = {county}
                year = {year}
                elcOptions = {elcOptions}
                ALL = {allCountiesVal}
              /> 
            )}
          
        </div>
      </div>
        <div className="StepButtons">
          
          <Space style={{marginTop: 16}}>
              <Button icon={<InfoCircleOutlined />} onClick={() => setHelpOpen(true)}>
                Instructions
              </Button>
              {current > 0 && current < 4 && <Button onClick={prev}>Back</Button>}
              {current> 0 && current < items.length - 1 && current !==3 &&(
                <Button type='primary' onClick={next} disabled={!goNextBut}>
                Next
                </Button>
              )}


            </Space>
        </div>
      </div>


        <Modal
          title="How to Use the CNA Web Tool"
          open={helpOpen}
          onCancel={() => setHelpOpen(false)}
          footer={null}
          width={800}
          styles={{ body: { maxHeight: '70vh', overflow: 'auto' } }}  
          destroyOnHidden                                           
        >
          <div>
            <Title level={5} style={{ marginTop: 0 }}>Step 1: Select Your ELC</Title>
            <Paragraph>
              Use the left-most dropdown to select your Early Learning Coalition (ELC).
              By default, the report includes all counties in your ELC’s service area.
              To view a single county, use the county dropdown next to the ELC selection.
            </Paragraph> 

            <Title level={5}>Step 2: Review the CNA Report Segments</Title>
            <Paragraph>
              <Text strong>Segment A – Demographics:</Text> population and demographic characteristics.<br />
              <Text strong>Segment B – Program Data:</Text> program-specific info (e.g., School Readiness, VPK).<br />
              <Text strong>Segment C – Indices & Insights:</Text> additional indices and analyses from ECPRG.
            </Paragraph>

            <Title level={5}>Step 3: Complete Additional Required Sections</Title>
            <Paragraph>
              <Text strong>Segment D – Community Resources & Feedback:</Text> summarize resources and local feedback.<br />
              <Text strong>Segment E – Summary & Priorities:</Text> provide an overall summary and priorities for the next period.
              A fillable template for Segment E is available at the provided link.
            </Paragraph>
          </div>
        </Modal>
      </Content>
      {/* <Footer className='FooterStyle' >Footer</Footer> */}
    </Layout>
    </div>
  )
}

export default App
