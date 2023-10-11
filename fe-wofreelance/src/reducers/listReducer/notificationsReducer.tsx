/* eslint-disable array-callback-return */
import { createSlice } from '@reduxjs/toolkit'
import { NotificationInterface, locationReducerInterface } from '../../interface'

interface reducerInterface {
    notifications: Array<NotificationInterface>
}
const initialState: reducerInterface = {
    notifications: []
}

const Notifications = createSlice({
    name: 'notifications',
   initialState,
    reducers: ({
        getAllNotifications: (state, actions) => {},
        getAllNotificationsSuccess: (state, actions) => {
            state.notifications = actions.payload;
        },
        receiveNotiResponse: (state, actions) => {
            state.notifications = [actions.payload, ...state.notifications]
        },
        updateNotification: (state, actions) => {},
        updateNotificationSuccess: (state, actions) => {
            const notificationsClone = [...state.notifications]
            const indexNoti = notificationsClone?.findIndex(item => item.id === actions.payload.notification_id)
            state.notifications[indexNoti] = {...state.notifications[indexNoti], noti_status: 'read'}
        }
    })
})

export const NotificationsActions = Notifications.actions;

const NotificationsReducer = Notifications.reducer;
export default NotificationsReducer;