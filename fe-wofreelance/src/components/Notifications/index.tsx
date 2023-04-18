// import * as AppActions from 'containers/App/actions'

import { Button, notification } from 'antd'
import { Notifications } from '../../interface'
// import { errorIcon } from 'assets'
// import './styles.scss'

export const openSuccess = (notiMess = null, notiDuration = null, notiPlacement = null) => {
    return notification.success({
        message: notiMess || 'Success',
        placement: notiPlacement || 'bottomRight',
        duration: notiDuration || 2
    })
}

export function openError(notiMess = null, notiDuration = null, notiPlacement = null) {
    notification.error({
        // icon: <img src={errorIcon} />,
        message: notiMess || 'Error',
        placement: notiPlacement || 'bottomRight',
        duration: notiDuration || 2
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