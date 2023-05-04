import React from 'react'

import { Link } from 'react-router-dom'
import './style.scss'
const GroupContent = () => {
    return (
        <div className="group-content-wrapper">
            <div className="group-content-item">
                <div className="group-content-item-header">
                    <div className="title">Groups</div>
                    <Link to="#"><div className="view-all">View all</div></Link>
                </div>
                <div className="group-content-item-content">
                    <Link to="#"><div className="title">General announcements</div></Link>
                    <div className="time-updated">Updated 9 days ago</div>
                </div>
            </div>
        </div>
    )
}

export default GroupContent
