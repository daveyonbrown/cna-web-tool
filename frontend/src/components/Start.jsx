import React from 'react'
import { Typography, Card, Button } from 'antd'
const { Title, Paragraph } = Typography


function Start({ onNext }) {
  return (
    <Card style={ { minHeight: '60vh'}}>
        <div className='StartContent'>
            <div>
                <Title level={3}>Community Needs Assessment (CNA) Web Tool Instructions</Title>
                <Paragraph>Welcome to the Community Needs Assessment (CNA) Web Tool, developed by
                    the University of Florida’s Anita Zucker Center for Excellence in Early Childhood Studies,
                    Early Childhood Policy Research Group (ECPRG).</Paragraph>

                <Paragraph>This tool provides a standardized template to help Florida’s Early Learning Coalitions (ELCs) prepare
                    their annual Community Needs Assessment. These pre-populated reports are designed to meet Florida’s statutory requirements 
                    while also incorporating indices and insights from program data and ECPRG's research.</Paragraph>

                <Paragraph strong>Please note: The template reports are not final. Each ELC must review, update, and complete the reports before submission.</Paragraph>
            </div>


                <Button className='StartButton' type="primary" onClick={onNext}>Get Started</Button>
        
        </div> 
    </Card>
  );
} 
export default Start