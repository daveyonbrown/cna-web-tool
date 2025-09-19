import React from 'react'
import { Row, Col, Space, Typography, Select, Card, Checkbox, Alert,Tooltip, Button}from 'antd'
import { QuestionCircleOutlined } from '@ant-design/icons'

const { Text, Title } = Typography




function Selector({ elc, setElc,county, setCounty,year,
    setYear,confirmElc,setConfirmElc,elcOptions,
    allCountiesVal,setClassThres,classThres}){

    // finds the elc that matches the selected one from value 
    const selectedElc = elcOptions.find(option => option.value === elc)

    // shows the county dropdown from the elc selected 
    const countyOptions = React.useMemo(() => {
        if (!selectedElc) return [];


        // if multi ocunties it populates as all counties
        if (selectedElc.type === 'multi') {
        return [{ value: allCountiesVal, label: 'All Counties' }, ...selectedElc.counties];
        }
        return selectedElc.counties;
    }, [selectedElc]);

    //if elc is shcanged it will set elc values back to default 
    const onElcChange = (newELC) => {

        setElc(newELC);
        const elcType = elcOptions.find( opt => opt.value === newELC);
        setConfirmElc(false);

        if(!elcType){
        setCounty(undefined);
        return;
        }
        if(elcType.type === 'multi'){
        setCounty(allCountiesVal);
        }
        else{
        setCounty(elcType.counties[0]?.value);
        }

    }

    const thisYear = new Date().getFullYear();

    //year drop down but only has current year 
    const yearOptions = React.useMemo(() => {
       return [{value: thisYear, label: String(thisYear)}];
    }, [thisYear]);

    const classOptions = React.useMemo(() => ([
        { value: 4.5, label: ' 4.5 and above' },
        { value: 5, label: '5.0 and above' } ]), []);



    return(
        <div className="StepBody">
            <div className="StepContent">
                <Card style={ { minHeight: '40vh'}}>
                    <Title level={4} style={{ marginTop: 0 }}>Select Your Early Learning Coalition</Title>

            
                    <Row gutter={[16, 16]} style={{ marginTop: 12 }}>
                        
                    {/* ELC */}
                    <Col xs={24} md={8}>
                        <Space direction="vertical" style={{ width: '100%' }}>
                        <Text strong>ELC</Text>
                        <Select
                            placeholder="Select ELC"
                            style={{ width: '100%' }}
                            options={elcOptions.map(({ value, label }) => ({ value, label }))}
                            value={elc}
                            onChange={onElcChange}
                            allowClear
                            showSearch
                            optionFilterProp="label"
                        />
                        </Space>
                    </Col>
            
                    {/* County */}
                    <Col xs={24} md={8}>
                        <Space direction="vertical" style={{ width: '100%' }}>
                        <Text strong>County</Text>
                        <Select
                            placeholder={elc ? 'Select County' : 'Select ELC first'}
                            style={{ width: '100%' }}
                            options={countyOptions}
                            value={county}
                            onChange={setCounty}
                            disabled={!elc}
                            allowClear={selectedElc?.type === 'multi'}
                            showSearch
                            optionFilterProp="label"
                        />
                        </Space>
                    </Col>
            
                    {/* Year */}
                    <Col xs={24} md={8}>
                        <Space direction="vertical" style={{ width: '100%' }}>
                        <Text strong>Year</Text>
                        <Select
                            placeholder="Select Year"
                            style={{ width: '100%' }}
                            options={yearOptions}
                            value={year}
                            onChange={setYear}
                        />
                        </Space>
                    </Col>
                    

                     {/* Class Score */}
                    <Col xs={24} md={8}>
                        <Space direction="vertical" style={{ width: '100%' }}>
                            <Text strong>CLASS Score</Text>
                            <div className='HelpButton'>
                                <Select
                                    placeholder="Select Class Threshold"
                                    style={{ width: '100%' }}
                                    options={classOptions}
                                    value={classThres}
                                    onChange={setClassThres}
                                />
                                <Tooltip
                                placement='bottom'
                                title='At the discretion of Early Learning Coalitions, Community Needs Assessment Section C can include results on SR and VPK providers who either have a CLASS Score of 4.5 and above or 5 and above (related to the provider quality performance incentive). This threshold can chosen based on the focus and priorities of the ELC, but by default, a CLASS threshold of 4.5 will be used for reporting purposes unless a CLASS Threshold of 5 is preferred.'
                                >
                                <QuestionCircleOutlined className='HelpIcon' />
                                </Tooltip>
                            </div>      
                        </Space>
                    </Col>
                    </Row>

                    {/* Confirmation */}
                    <div style={{ marginTop: 16 }}>
                    <Checkbox
                        checked={confirmElc}
                        onChange={(e) => setConfirmElc(e.target.checked)}
                        disabled={!elc || !county}   
                    >
                        I confirm the selected ELC 
                        {elc && ` (${elcOptions.find(o => o.value === elc)?.label})`} 
                        and county 
                        {county && ` (${county === allCountiesVal ? 'All Counties' : county})`} 
                        are correct.
                    </Checkbox>

                        {!confirmElc && elc && (
                            <Alert
                            style={{ marginTop: 12 }}
                            type="info"
                            showIcon
                            message="Please confirm your selection"
                            description="Checking the box helps prevent selecting the wrong coalition or county by accident."
                            />
                        )}
                    </div>

                </Card> 
            </div>
        </div>
    )
}
export default Selector


  
  

  

  

  
