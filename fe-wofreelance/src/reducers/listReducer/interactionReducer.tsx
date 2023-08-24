import { createSlice } from '@reduxjs/toolkit'
import { InteractionReducer, latestMessageInterface } from '../../interface';
import _ from 'lodash'

interface interactionReducer {
    interactions: Array<InteractionReducer>,
    latestMessages: Array<latestMessageInterface>,
    unread_messages: number
}

// chat_window_status: open, hide, close, focus

const initialState: interactionReducer = {
    interactions: [],
    latestMessages: [],
    unread_messages: 0
}

const Interactions = createSlice({
    name: 'interactions',
    initialState,
    reducers: ({
        addInteraction: (state, actions) => {
            const idxCurrentInteraction = [...state.interactions]?.findIndex(interaction => _.isEqual(interaction.users?.sort((a, b) => a.id! - b.id!), actions.payload.users?.sort((a: any, b: any) => a.id - b.id)) && interaction.message_title === actions.payload.message_title)
            const idxCurrentFocus = [...state.interactions]?.findIndex((interaction) => interaction.chat_window_status === 'focus')
            state.interactions[idxCurrentFocus] = { ...state.interactions[idxCurrentFocus], chat_window_status: 'open' }
            if (idxCurrentInteraction === -1) {
                state.interactions = [...state.interactions, { ...actions.payload, chat_window_status: 'focus' }]
            } else {
                state.interactions[idxCurrentInteraction] = { ...state.interactions[idxCurrentInteraction], chat_window_status: 'focus' }
            }
        },
        modifyInteraction: (state, actions) => {
            const idxCurrentInteraction = [...state.interactions]?.findIndex((interaction) => _.isEqual(interaction.users?.sort((a, b) => a.id! - b.id!), actions.payload.users?.sort((a: any, b: any) => a.id - b.id)) && interaction.message_title === actions.payload.message_title)
            const idxCurrentFocus = [...state.interactions]?.findIndex((interaction) => interaction.chat_window_status === 'focus')
            if (idxCurrentInteraction === idxCurrentFocus) {
                state.interactions[idxCurrentInteraction] = { ...state.interactions[idxCurrentInteraction], chat_window_status: actions.payload.chat_window_status }
            } else {
                state.interactions[idxCurrentInteraction] = { ...state.interactions[idxCurrentInteraction], chat_window_status: actions.payload.chat_window_status }
                state.interactions[idxCurrentFocus] = { ...state.interactions[idxCurrentFocus], chat_window_status: 'open' }
            }
        },

        sendMessages: (state, actions) => { },

        sendMessagesSuccess: (state, actions) => {
            const latestMessagesClone = [...state.latestMessages]
            let interactionsClone = [...state.interactions]
            let unreadMess = 0
            if (actions.payload.interaction_state === 'create') {
                const roomName = actions?.payload.room_name?.split(',').map((user: string) => {
                    if (user.trim() !== actions.payload.currentUser && user !== '') {
                        return user.trim()
                    }
                })?.filter((item: string) => item)?.join(',')
                const chatStatus = actions.payload?.users.some((user: any) => user.user_active)
                const { interaction_state, ...others } = actions.payload
                latestMessagesClone.push({ ...others, is_online: chatStatus, room_name: roomName })
            } else {
                const currentLatestMess = latestMessagesClone?.findIndex(room => room.id === actions.payload.id)
                const chatStatus = latestMessagesClone[currentLatestMess]?.users?.some((user: any) => user.user_active)
                latestMessagesClone[currentLatestMess] = {
                    ...latestMessagesClone[currentLatestMess],
                    unread_messages: actions?.payload?.unread_messages,
                    messages: {
                        ...actions.payload.messages,
                        sender_info: latestMessagesClone[currentLatestMess].messages.sender_info
                    },
                    is_online: chatStatus
                }
            }
            unreadMess = latestMessagesClone.reduce((acc:any, o:any) => acc + parseInt(o.unread_messages), 0)

            const currentInteracion = interactionsClone?.findIndex((interaction, index) => interaction.room_id === actions.payload.id) 
            if(currentInteracion === -1) {
                interactionsClone.push({
                    message_title: actions.payload.messages.message_title,
                    users: actions.payload.users,
                    message_url: actions.payload.messages.message_title_url,
                    chat_window_status: 'open',
                    room_id: actions.payload.id
                })
            } else {
                interactionsClone[currentInteracion] = {
                    ...interactionsClone[currentInteracion],
                    message_title: actions.payload.messages.message_title,
                    message_url: actions.payload.messages.message_title_url,
                    room_id: actions.payload.id
                }
            }

            return {
                ...state,
                latestMessages: latestMessagesClone,
                interactions: interactionsClone,
                unread_messages: unreadMess
            }
        },

        getLatestMessageOfRoom: (state, actions) => { },
        getLatestMessageOfRoomSuccess: (state, actions) => {
            // const latestMessagesClone = [...state.latestMessages]
            // const currentLatestMess = latestMessagesClone?.findIndex(msg => msg.id === actions.payload.id)
            // const roomName = actions?.payload?.room_name?.split(',').map((user: any) => {
            //     if (user.trim() !== actions.payload.currentUser && user !== '') {
            //         return user.trim()
            //     }
            // })?.filter((item: any) => item)?.join(',')

            // const chatStatus = actions.payload?.users.some((user:any) => user.user_active)

            // latestMessagesClone[currentLatestMess] = {...actions.payload, room_name: roomName, is_online: chatStatus}
            // debugger
            // return {
            //     ...state,
            //     latestMessages: latestMessagesClone
            // }
        },


        getAllLatestMessages: (state, actions) => { },
        getAllLatestMessagesSuccess: (state, actions) => {
            state.latestMessages = actions.payload?.messages?.map((item: latestMessageInterface) => {
                const chatStatus = item?.users.some((user) => user.user_active)
                const roomName = item?.room_name?.split(',').map((user) => {
                    if (user.trim() !== actions.payload.currentUser && user !== '') {
                        return user.trim()
                    }
                })?.filter((item) => item)?.join(',')
                return {
                    ...item,
                    room_name: roomName,
                    is_online: chatStatus
                }
            })
            state.unread_messages = actions?.payload?.messages?.reduce((acc: any, o: any) => acc + parseInt(o.unread_messages), 0)
        },

        increaseNotificationsMessage: (state, actions) => {
            console.log(state.latestMessages)
            const latestMessagesClone = [...state.latestMessages]
            const roomFoundIndex: number = latestMessagesClone.findIndex((item) => item.id === actions.payload.room)
            if (latestMessagesClone[roomFoundIndex]?.messages?.message_status === 'seen') {
                latestMessagesClone[roomFoundIndex].messages.message_status = 'received'
            }
            return {
                ...state,
                latestMessages: latestMessagesClone
            }
        }
    })
})

export const InteractionsActions = Interactions.actions;

const InteractionsReducer = Interactions.reducer;
export default InteractionsReducer;