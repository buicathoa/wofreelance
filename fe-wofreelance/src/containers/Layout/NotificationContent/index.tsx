import React, { useRef, useState } from 'react'
import { SettingOutlined, CalendarOutlined, LeftOutlined, CheckOutlined, CloseOutlined } from '@ant-design/icons'
import { notification } from '../../../assets'

import './style.scss'
import { Button, Switch } from 'antd'
import usePrevious from '../../../utils/usePrevious'

const NotificationContent = () => {
    const [notiType, setNotiType] = useState<string>('recent')
    const prevState:string | undefined = usePrevious(notiType)

    const handleOpenNotiType = (type: string) => {
        setNotiType(type)
    }

    return (
        <div className="notification-content-wrapper">
            {notiType !== 'settings' ?
                <div className={`notification-header`}>
                    <div className={`header-item ${notiType === 'recent' ? 'active' : ''}`} onClick={() => handleOpenNotiType('recent')}>Recent Updated</div>
                    <div className={`header-item ${notiType === 'saved' ? 'active' : ''}`} onClick={() => handleOpenNotiType('saved')}>Saved Alerts</div>
                    <SettingOutlined className="setting-icon" onClick={() => handleOpenNotiType('settings')} />
                </div> : <div className="notification-header settings">
                    <LeftOutlined className="back-icon" onClick={() => setNotiType(prevState!)}/>
                    <div className="header-notify-text">NOTIFICATIONS SETTINGS</div>
                </div>
            }
            <div className={`notification-lists ${notiType === 'recent' ? '' : 'hidden'}`}>
                <div className="notification-item">
                    <div className="notification-image">
                        <CalendarOutlined />
                    </div>
                    <div className="notification-content">
                        <div className="title">Wordpress contactfrom 7 popup...</div>
                        <div className="content">CSS, HTML, PHP an sdo much more...</div>
                    </div>
                </div>
                <div className="notification-item">
                    <div className="notification-image">
                        <CalendarOutlined />
                    </div>
                    <div className="notification-content">
                        <div className="title">Wordpress contactfrom 7 popup...</div>
                        <div className="content">CSS, HTML, PHP and so much more...</div>
                    </div>
                </div>
                <div className="notification-item">
                    <div className="notification-image">
                        <CalendarOutlined />
                    </div>
                    <div className="notification-content">
                        <div className="title">Wordpress contactfrom 7 popup...</div>
                        <div className="content">CSS, HTML, PHP and so much more...</div>
                    </div>
                </div>
                <div className="notification-item">
                    <div className="notification-image">
                        <CalendarOutlined />
                    </div>
                    <div className="notification-content">
                        <div className="title">Wordpress contactfrom 7 popup...</div>
                        <div className="content">CSS, HTML, PHP and so much more...</div>
                    </div>
                </div>
                <div className="notification-item">
                    <div className="notification-image">
                        <CalendarOutlined />
                    </div>
                    <div className="notification-content">
                        <div className="title">Wordpress contactfrom 7 popup...</div>
                        <div className="content">CSS, HTML, PHP and so much more...</div>
                    </div>
                </div>
                <div className="notification-item">
                    <div className="notification-image">
                        <CalendarOutlined />
                    </div>
                    <div className="notification-content">
                        <div className="title">Wordpress contactfrom 7 popup...</div>
                        <div className="content">CSS, HTML, PHP and so much more...</div>
                    </div>
                </div>
                <div className="notification-item">
                    <div className="notification-image">
                        <CalendarOutlined />
                    </div>
                    <div className="notification-content">
                        <div className="title">Wordpress contactfrom 7 popup...</div>
                        <div className="content">CSS, HTML, PHP and so much more...</div>
                    </div>
                </div>
                <div className="notification-item">
                    <div className="notification-image">
                        <CalendarOutlined />
                    </div>
                    <div className="notification-content">
                        <div className="title">Wordpress contactfrom 7 popup...</div>
                        <div className="content">CSS, HTML, PHP and so much more...</div>
                    </div>
                </div>
            </div>
            <div className={`saved-notification ${notiType === 'saved' ? '' : 'hidden'}`}>
                <img src={notification} alt="" />
                <div className="saved-notification-text">
                    Get ready! Notifications will start rolling in any minute now.
                </div>
            </div>
            <div className={`settings-notification ${notiType === 'settings' ? '' : 'hidden'}`}>
                <div className="settings-item">
                    <div className="title">Saved Alerts</div>
                    <div className="settings-item-image">
                        <img src={notification} alt="" />
                    </div>
                    <div className="content">
                        Receive alerts for new projects based on your saved searches. Create one to start receiving notifications
                    </div>
                    <div className="settings-item-button">
                        <Button>Search Projects</Button>
                    </div>
                </div>
                <div className="settings-item">
                    <div className="title">My skills</div>
                    <div className="content skills">
                        Receive notifications for any new project tagged under these category of skills.
                    </div>
                    <div className="lists-skills">
                        <div className="skill-item custom-form-item">
                            <Switch
                                defaultChecked
                                size='small'
                                className="form-switch"
                            />
                            <div className="switch-text">HTML</div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default NotificationContent
