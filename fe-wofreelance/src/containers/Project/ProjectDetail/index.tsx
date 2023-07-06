import { Col, Row, Tabs } from 'antd'
import React from 'react'
import './style.scss'
import { Details } from './Details'
export const ProjectDetail = () => {
    const {TabPane} = Tabs
    return (
        <div className="project-detail-wrapper">
            <div className="project-detail-container">
            <div className="project-detail-header-infomation">
                <Row>
                    <Col span={17}>
                        <div className="project-detail-header-infomation-left">
                            <div className="title">Looking for a Graphic designer to design a one page keypad interface for my product</div>
                            <div className="post-status open">Open</div>
                        </div>
                    </Col>
                    <Col span={7}>
                        <div className="bids-header-info">
                            <span>Bids</span>
                            <span>6</span>
                        </div>
                        <div className="bids-header-info">
                            <span>Average bid</span>
                            <span>₹1,067 INR</span>
                        </div>
                    </Col>
                </Row>
            </div>
            <div className="project-detail-tabs">
            <Tabs
                    className="overview_activities-tab activities custom-tab"
                    defaultActiveKey="1"
                    // onChange={(key) => onChangeTab(key)}
                >
                    <TabPane tab={<div>Details</div>} key="1">
                        <Details />
                    </TabPane>
                    <TabPane tab={<div>Proposals</div>} key="2">
                        Proposals
                    </TabPane>
                </Tabs>
            </div>
            <div className="project-detail-content">
            </div>
            </div>
        </div>
    )
}
