import { Button, notification } from 'antd'
import './style.scss'
import { ProjectOutlined } from '@ant-design/icons'
import { useNavigate } from 'react-router-dom'

interface modalNotifications {
    notiMess?: string,
    description?: string,
    noti_url?: any
}
export function modalNotifications({notiMess, description, noti_url}: modalNotifications) {
    return (
        notification.success({
            message: notiMess || 'Success',
            description: description,
            placement: 'bottomLeft',
            duration: 2,
            icon: <ProjectOutlined />,
            onClick: () => {
                window.location.replace(`/${noti_url}`)
            }
        })
    )
}
