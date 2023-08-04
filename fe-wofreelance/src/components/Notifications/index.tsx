// import * as AppActions from 'containers/App/actions'

import { Button, notification, message } from 'antd'
import { Notifications } from '../../interface'
// import { errorIcon } from 'assets'
// import './styles.scss'

interface openMessageInterface {
    notiMess?: string,
    notiDuration?: number
}

export const openSuccess = ({notiMess, notiDuration}: openMessageInterface) => {
    return message.open({
        type: 'success',
        content: notiMess ?? 'Action success',
        duration: notiDuration,
    })
}

export function openError({notiMess, notiDuration}: openMessageInterface) {
    message.open({
        type: 'error',
        content: notiMess,
        duration: notiDuration
    })
}

export function openWarning({notiMess, notiDuration}: openMessageInterface) {
    notification.warning({
        // icon: <img src={errorIcon} />,
        message: notiMess || 'Warning',
        placement: 'bottomRight',
        duration: notiDuration || 2
    })
}