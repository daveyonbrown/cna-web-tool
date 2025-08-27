import React from 'react'
import {Tabs,Row, Col, Card,Typography,Button,Space,Tooltip, Modal,Empty} from 'antd'
import { EyeOutlined, DownloadOutlined } from '@ant-design/icons'

const { Title, Text } = Typography

function Review({ elc, county, year, elcOptions, ALL }) {
    
  // finds the selected elc 
  const selectedElc = elcOptions.find(opt => opt.value === elc)

  // decides which counties to show as tabs
  const countiesForTabs = React.useMemo(() => {
    if (!selectedElc) return []
    if (county && county !== ALL) {
      const cObj = selectedElc.counties.find(c => c.value === county)
      return cObj ? [cObj] : []
    }
    return selectedElc.counties
  }, [selectedElc, county, ALL])

  // sections per county
  const SECTIONS = [
    { key: 'A', title: 'Segment A', desc: 'Demographics' },
    { key: 'B', title: 'Segment B', desc: 'Program Data' },
    { key: 'C', title: 'Segment C', desc: 'Indices & Insights' },
  ]

  //  preview and download calls for the sections  to load 
  const buildPreviewUrl = (sectionKey, countyVal) =>
    `/api/preview?year=${encodeURIComponent(year)}&elc=${encodeURIComponent(elc)}&county=${encodeURIComponent(countyVal)}&section=${encodeURIComponent(sectionKey)}`

  const buildDownloadUrl = (sectionKey, countyVal) =>
    `/api/download?year=${encodeURIComponent(year)}&elc=${encodeURIComponent(elc)}&county=${encodeURIComponent(countyVal)}&section=${encodeURIComponent(sectionKey)}`

  // for the modal to open and populate
  const [isModalOpen, setIsModalOpen] = React.useState(false)
  const [modalCounty, setModalCounty] = React.useState(null)   
  const [modalSection, setModalSection] = React.useState(null) 

  const openPreviewModal = (sectionKey, countyVal) => {
    setModalSection(sectionKey)
    setModalCounty(countyVal)
    setIsModalOpen(true)
  }

  const closePreviewModal = () => {
    setIsModalOpen(false)
  }

  // builds the tabs for each item
  const items = countiesForTabs.map(c => {
    const countyKey = c.value

    return {


      label: c.label,
      key: countyKey,
      children: (

        <div style={{ paddingTop: 12 }}>
          <Row gutter={[16, 16]}>

            {SECTIONS.map(s => (
              <Col xs={24} md={8} key={s.key}>
                <Card hoverable style={{ minHeight: 320, display: 'flex', flexDirection: 'column' }}>

                  <div>
                    <Title level={5} style={{ marginBottom: 4 }}>{s.title}</Title>
                    <Text type="secondary">{s.desc}</Text>
                    <div style={{ marginTop: 8, fontSize: 12, opacity: 0.75 }}>
                      ELC: {selectedElc?.label || '—'} <br />
                      County: {c.label} <br />
                      Year: {year}
                    </div>
                  </div>

                  <div style={{ marginTop: 12 }}>
                    <Space>
                      <Button
                        icon={<EyeOutlined />}
                        onClick={() => openPreviewModal(s.key, countyKey)}
                      >
                        Preview
                      </Button>

                    <Tooltip title="Download PDF">
                    <Button
                        icon={<DownloadOutlined />}
                        href={buildDownloadUrl(s.key, countyKey)}
                        target="_self"
                     >
                          Download
                        </Button>
                    </Tooltip>
                    </Space>
                  </div>
                </Card>
              </Col>
            ))}
          </Row>
        </div>
      ),
    }
  })


  return (
    <div className="StepBody">
      <div className="StepContent">
        <Card style={{ display: 'flex', flexDirection: 'column' }}>
          <Title level={4} style={{ marginTop: 0 }}>Review documents</Title>
          <Text>Choose a county tab. Preview each section or download the PDF.</Text>

          <div style={{ marginTop: 16 }}>
            <Tabs
              type="card"
              items={items}
              defaultActiveKey={
                county && county !== ALL
                  ? county
                  : countiesForTabs[0]?.value
              }
            />
          </div>
        </Card>

        {/* Preview Modal- single reused for any card */}
        <Modal
          title={
            <span>
              Preview — Section {modalSection}
              {modalCounty ? ` • ${modalCounty}` : ''}
            </span>
          }
          open={isModalOpen}
          onCancel={closePreviewModal}
          footer={null}
          width={1000}
          bodyStyle={{ padding: 0, height: '70vh' }}
          destroyOnClose
        >
          {modalSection && modalCounty && (
            <iframe
              title={`Preview ${modalSection} - ${modalCounty}`}
              src={buildPreviewUrl(modalSection, modalCounty)}
              style={{ width: '100%', height: '100%', border: 'none' }}
            />
          )}
        </Modal>
      </div>
    </div>
  )
}
export default Review