import React from 'react'
import { DesktopOutlined, HeartOutlined, CalendarOutlined, EyeOutlined, CheckCircleOutlined } from '@ant-design/icons'

import './style.scss'
import { Link } from 'react-router-dom'
const ManageContent = () => {
    return (
        <div className="manage-content-wrapper">
            <div className="manage-content-item">
                <div className="manage-content-item-header">
                    <div className="title">Recent Projects</div>
                    <Link to="#"><div className="view-all">View all</div></Link>
                </div>
                <div className="manage-content-item-content">
                    <div className="content-item">
                        <DesktopOutlined />
                        <div className="content-text">Finding good UI/UX to help me to design figma...</div>
                    </div>
                </div>
            </div>
            <div className="manage-content-item">
                <div className="manage-content-item-header">
                    <div className="title">Lists</div>
                    <Link to="#"><div className="view-all">View all</div></Link>
                </div>
                <div className="manage-content-item-content">
                    <div className="content-item">
                        <HeartOutlined className="heart"/>
                        <div className="content-text">Favorites</div>
                    </div>
                    <div className="content-item">
                        <CalendarOutlined />
                        <div className="content-text">My Hires</div>
                    </div>
                    <div className="content-item">
                        <EyeOutlined />
                        <div className="content-text">Recently Views</div>
                    </div>
                </div>
            </div>
            <div className="manage-content-item">
                <div className="manage-content-item-header">
                    <div className="title">Tasklists</div>
                    <Link to="#"><div className="view-all">View all</div></Link>
                </div>
                <div className="manage-content-item-content">
                    <div className="content-item">
                        <CheckCircleOutlined />
                        <div className="content-text tasklist">buicathoa's tasklists</div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default ManageContent
