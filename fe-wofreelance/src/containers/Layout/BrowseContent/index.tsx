import React from 'react'
import { SearchOutlined, FolderOpenFilled, TrophyFilled, QqCircleFilled, FlagFilled } from '@ant-design/icons'
import { Col, Input, Row } from 'antd'
import './style.scss'
const BrowseContent = () => {
  return (
    <div className="browse-content-wrapper">
      <div className="browse-search custom-form-item">
        <Input placeholder='Search Wofreelance.com' className="form-input" prefix={<SearchOutlined />} />
      </div>
      <div className="browse-search-container">
        <div className="browse-search-title">Search</div>
        <Row>
          <Col span={6} className="browse-search-item">
            <FolderOpenFilled />
            <div className="browse-search-info">
              <div className="title">Projects</div>
              <div className="description">
                Explore new exciting new project opportunities now. 
              </div>
            </div>
          </Col>
          <Col span={6} className="browse-search-item">
            <TrophyFilled />
            <div className="browse-search-info">
              <div className="title">Contests</div>
              <div className="description">
                Unleash your talents and win wofreelance contests.
              </div>
            </div>
          </Col>
          <Col span={6} className="browse-search-item">
            <QqCircleFilled />
            <div className="browse-search-info">
              <div className="title">Freelancers</div>
              <div className="description">
                Find top rated freelancers for your project. 
              </div>
            </div>
          </Col>
          <Col span={6} className="browse-search-item">
            <FlagFilled />
            <div className="browse-search-info">
              <div className="title">Bookmarks</div>
              <div className="description">
                Access your saved project and contest opportunities. 
              </div>
            </div>
          </Col>
        </Row>
      </div>
    </div>
  )
}

export default BrowseContent
