import React from 'react'
import { Card, Button, Result } from 'antd'

function Complete({ onNext }) {
  return (
    <Card style={ { minHeight: '60vh'}}>
        <div className='StartContent'>
           <Result
            status= 'success'
            title= 'Your CNA Report is Complete!'
            subTitle = 'Please review your report carefully before official submission. You may start a new report at any time.'
            extra= {[
                <Button type='primary' key='restart' onClick={onNext}>
                Start Over
                </Button>,
            ]}
             />   
        </div> 
    </Card>
  );
} 
export default Complete