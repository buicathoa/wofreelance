// import * as AppActions from 'containers/App/actions'

import { Button, notification, message } from 'antd'
import { Notifications } from '../../interface'
// import { errorIcon } from 'assets'
// import './styles.scss'

export const openSuccess = (notiMess = 'Action success', notiDuration = 3, notiPlacement = null): any => {
    return message.open({
        type: 'success',
        content: notiMess,
        duration: notiDuration
    })
}

export function openError(notiMess: string, notiDuration = 3, notiPlacement = null) {
    message.open({
        type: 'error',
        content: notiMess,
        duration: notiDuration
    })
}

export function openWarning(notiMess: string, notiDuration = null, notiPlacement = null) {
    notification.warning({
        // icon: <img src={errorIcon} />,
        message: notiMess || 'Warning',
        placement: notiPlacement || 'bottomRight',
        duration: notiDuration || 2
    })
}