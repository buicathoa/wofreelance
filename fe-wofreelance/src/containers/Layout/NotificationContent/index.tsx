import React, { useRef, useState } from 'react'
import { SettingOutlined, CalendarOutlined, LeftOutlined, BellTwoTone, CloseOutlined } from '@ant-design/icons'
import { notification } from '../../../assets'

import './style.scss'
import { Button, Empty, Switch } from 'antd'
import usePrevious from '../../../utils/usePrevious'
import { NotificationInterface, ResponseFormatItem } from '../../../interface'
import { useNavigate } from 'react-router-dom'
import { HREF } from '../../../constants'
import { NotificationsActions } from '../../../reducers/listReducer/notificationsReducer'
import { useDispatch } from 'react-redux'

interface NotificationContent {
    notifications: Array<NotificationInterface>
}

const NotificationContent = ({ notifications }: NotificationContent) => {
    const navigate = useNavigate()
    const dispatch = useDispatch()
    const [notiType, setNotiType] = useState<string>('recent')
    const prevState: string | undefined = usePrevious(notiType)

    const updateNotification = (param: any): Promise<ResponseFormatItem> => {
        return new Promise((resolve, reject) => {
            dispatch(NotificationsActions.updateNotification({ param, resolve, reject }));
        });
    }

    const handleOpenNotiType = (type: string) => {
        setNotiType(type)
    }

    const handleToggleNotification = (noti: NotificationInterface) => {
        updateNotification({
            notification_id: noti.id
        }).then(() => {
            navigate(noti.noti_url, {replace: true})
        })
    }
    return (
        <div className="notification-content-wrapper">
            {notiType !== 'settings' ?
                <div className={`notification-header`}>
                    <div className={`header-item ${notiType === 'recent' ? 'active' : ''}`} onClick={() => handleOpenNotiType('recent')}>Recent Updated</div>
                    <div className={`header-item ${notiType === 'saved' ? 'active' : ''}`} onClick={() => handleOpenNotiType('saved')}>Saved Alerts</div>
                    <SettingOutlined className="setting-icon" onClick={() => handleOpenNotiType('settings')} />
                </div> : <div className="notification-header settings">
                    <LeftOutlined className="back-icon" onClick={() => setNotiType(prevState!)} />
                    <div className="header-notify-text">NOTIFICATIONS SETTINGS</div>
                </div>
            }
            <div className={`notification-lists ${notiType === 'recent' ? '' : 'hidden'}`}>
                {notifications.length > 0 ? notifications?.map((noti: NotificationInterface, idx: number) => {
                    if (noti.noti_type === 'post') {
                        return (
                            <div className="notification-item" key={idx} onClick={() => handleToggleNotification(noti)}>
                                <div className="notification-item-left">
                                    <div className="notification-image">
                                        <BellTwoTone />
                                    </div>
                                    <div className="notification-content">
                                        <div className="title">{noti.noti_title}</div>
                                        <div className="content">{noti.noti_content}</div>
                                    </div>
                                </div>
                                {noti?.noti_status === 'received' && <div className="read" />}
                            </div>
                        )
                    }
                }) : <Empty/>}
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
