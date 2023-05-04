import React, { useState } from 'react'
import { live_chat } from '../../../assets'

import './style.scss'
import { Link } from 'react-router-dom'
const MessagesContent = () => {
    const [messageList, setMessageList] = useState([1])
    return (
        <div className="message-content-wrapper">
            <div className="message-content-header">
                <div className="title">Recent Messages</div>
                <Link to="#"><div className="view-all">View all</div></Link>
            </div>
            <div className="message-content-main">
                {messageList.length === 0 ?
                    <div className="message-content-empty">
                        <div className="message-content-empty-image">
                            <img src={live_chat} alt="" />
                        </div>
                        <div className="message-content-empty-text">
                            Start connecting with others by <Link to="#">browsing</Link> or <Link to="#">posting a project</Link>
                        </div>
                    </div> : <div className="messages-list">
                        <div className="message-item">
                            <div className="avatar">
                                <img src="https://res.cloudinary.com/dqzprqtqg/image/upload/v1682311658/root/enzo_harhht.jpg" alt="" />
                            </div>
                            <div className="message-item-content">
                                <div className="sender-info">
                                    <div className="sender-name">Alisharoz A. <span className="sender-email">@alisharoz</span></div>
                                    <div className="message-latest-time">Apr 12</div>
                                </div>
                                <div className="message-info">
                                    Hey, i'm so interested in your projects
                                </div>
                            </div>
                        </div>
                        <div className="message-item">
                            <div className="avatar">
                                <img src="https://res.cloudinary.com/dqzprqtqg/image/upload/v1682311658/root/enzo_harhht.jpg" alt="" />
                            </div>
                            <div className="message-item-content">
                                <div className="sender-info">
                                    <div className="sender-name">Alisharoz A. <span className="sender-email">@alisharoz</span></div>
                                    <div className="message-latest-time">Apr 12</div>
                                </div>
                                <div className="message-info">
                                    Hey, i'm so interested in your projects
                                </div>
                            </div>
                        </div>
                    </div>
                }
            </div>
        </div>
    )
}

export default MessagesContent
