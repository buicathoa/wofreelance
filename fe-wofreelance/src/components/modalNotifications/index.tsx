import { Button, notification } from 'antd'
import './style.scss'
import { ProjectOutlined } from '@ant-design/icons'

export function modalNotifications(notiMess?: string, description?: string) {
    notification.success({
        message: notiMess || 'Success',
        description: description,
        placement: 'bottomLeft',
        duration: 2,
        icon: <ProjectOutlined />
    })
}
