import React from 'react'
import './style.scss'
import { Link } from 'react-router-dom'

const ProfileContent = () => {
    return (
        <div className="profile-content-wrapper">
            <div className="profile-content-item">
                <div className="profile-content-title">Account</div>
                <div className="profile-content-list">
                    <ul>
                        <li><Link to="#">View profile</Link></li>
                        <li><Link to="#">Membership</Link></li>
                        <li><Link to="#">Account analytics</Link></li>
                        <li><Link to="#">Bid Insights</Link></li>
                        <li><Link to="#">Settings</Link></li>
                    </ul>
                </div>
                <div className="profile-content-list">
                    <ul>
                        <li><Link to="#">Support</Link></li>
                        <li><Link to="#">Invite Friends</Link></li>
                        <li><Link to="#">Logout</Link></li>
                    </ul>
                </div>
            </div>
        </div>
    )
}

export default ProfileContent