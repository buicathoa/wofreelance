/* eslint-disable array-callback-return */

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
            let idxCurrentInteraction = -1
            if (!actions?.payload?.room_id) {
                idxCurrentInteraction = [...state.interactions]?.findIndex((interaction: any) => (_.isEqual(interaction.users?.sort((a: any, b: any) => a.id! - b.id!), actions.payload.users?.sort((a: any, b: any) => a.id - b.id)) && interaction.room_title === actions.payload.room_title))
            } else {
                idxCurrentInteraction = [...state.interactions]?.findIndex((interaction: any) => interaction.room_id === actions.payload.room_id)
            }
            const idxCurrentFocus = [...state.interactions]?.findIndex((interaction) => interaction.chat_window_status === 'focus')
            state.interactions[idxCurrentFocus] = { ...state.interactions[idxCurrentFocus], chat_window_status: 'open' }
            if (idxCurrentInteraction === -1) {
                state.interactions = [...state.interactions, { ...actions.payload, chat_window_status: 'focus' }]
            } else {
                state.interactions[idxCurrentInteraction] = { ...state.interactions[idxCurrentInteraction], ...actions.payload, chat_window_status: 'focus' }
            }
        },
        modifyInteraction: (state, actions) => {
            let idxCurrentInteraction = -1

            if (!actions?.payload?.room_id) {
                idxCurrentInteraction = [...state.interactions]?.findIndex((interaction: any) => (_.isEqual([...interaction?.users]?.sort((a: any, b: any) => a.id! - b.id!), [...actions?.payload.users]?.sort((a: any, b: any) => a.id - b.id)) && interaction?.room_title === actions?.payload?.room_title))
            } else {
                idxCurrentInteraction = [...state.interactions]?.findIndex((interaction: any) => interaction.room_id === actions.payload.room_id)
            }
            const idxCurrentFocus = [...state.interactions]?.findIndex((interaction) => interaction.chat_window_status === 'focus')
            if (idxCurrentInteraction === idxCurrentFocus) {
                state.interactions[idxCurrentInteraction] = { ...state.interactions[idxCurrentInteraction], chat_window_status: actions.payload.chat_window_status }
            } else {
                state.interactions[idxCurrentInteraction] = { ...state.interactions[idxCurrentInteraction], chat_window_status: actions.payload.chat_window_status }
                state.interactions[idxCurrentFocus] = { ...state.interactions[idxCurrentFocus], chat_window_status: 'open' }
            }
        },

        closeInteraction: (state, actions) => {
            state.interactions = [...state.interactions]?.filter((item, index) => index !== actions.payload)
        },

        sendMessages: (state, actions) => { },

        sendMessagesSuccess: (state, actions) => {
            const latestMessagesClone = [...state.latestMessages]
            let interactionsClone = [...state.interactions]
            const currentLatestMess = latestMessagesClone?.findIndex(room => room.id === actions.payload.id)
            const currentInteraction = interactionsClone?.findIndex((interaction) => interaction.id === actions.payload.id)
            if (currentLatestMess !== -1) {
                const usersSeenState = latestMessagesClone[currentLatestMess]?.users?.map((u) => {
                    if(u.id !== actions?.payload?.messages?.sender_info?.id) {
                        return {...u, status_info: {...u?.status_info, message_status: 'received'}}
                    } else {
                        return {...u, status_info: {...u?.status_info, message_status: 'seen'}}
                    }
                })
                const chatStatus = latestMessagesClone[currentLatestMess]?.users?.some((user: any) => user.user_active)
                latestMessagesClone[currentLatestMess] = {
                    ...latestMessagesClone[currentLatestMess],
                    ...actions.payload,
                    is_online: chatStatus
                }
                interactionsClone[currentInteraction] = { ...interactionsClone[currentInteraction], room_id: actions.payload.id, messages: [...interactionsClone[currentInteraction].messages!, actions?.payload?.messages], total: interactionsClone[currentInteraction]?.total! + 1, users: usersSeenState }
            } else {
                const chatStatus = actions.payload?.users?.some((user: any) => user.user_active)
                latestMessagesClone.push({ ...actions.payload, is_online: chatStatus, unread_messages: 0 })
                interactionsClone = [{ ...actions.payload, room_id: actions.payload.id, chat_window_status: 'focus', messages: [actions?.payload?.messages], total: 1 }]
            }

            return {
                ...state,
                latestMessages: latestMessagesClone,
                interactions: interactionsClone
            }
        },

        getLatestMessageOfRoom: (state, actions) => { },
        getLatestMessageOfRoomSuccess: (state, actions) => { },


        getAllLatestMessages: (state, actions) => { },
        getAllLatestMessagesSuccess: (state, actions) => {
            state.latestMessages = actions.payload?.data?.map((item: latestMessageInterface) => {
                const chatStatus = item?.users?.filter((u) => u.username !== actions.payload.currentUser)?.some((user) => user.user_active)
                return {
                    ...item,
                    is_online: chatStatus
                }
            })
        },

        addNewMessagesReceived: (state, actions) => {
            const latestMessagesClone = [...state.latestMessages]
            const interactionsClone = [...state.interactions]
            const currentLatestMess = latestMessagesClone?.findIndex(room => room.id === actions.payload.id)
            const currentInteraction = [...state.interactions]?.findIndex((interaction) => interaction.id === actions.payload.id)
            if (currentLatestMess !== -1) {
                const chatStatus = latestMessagesClone[currentLatestMess]?.users?.some((user: any) => user.user_active)
                if (currentInteraction !== -1) {
                    const { messages, ...others } = actions?.payload
                    interactionsClone[currentInteraction] = { ...interactionsClone[currentInteraction], ...others, messages: [...interactionsClone[currentInteraction].messages!, messages], total: interactionsClone[currentInteraction]?.total! + 1 }
                }
                latestMessagesClone[currentLatestMess] = {
                    ...latestMessagesClone[currentLatestMess],
                    ...actions.payload,
                    unread_messages: latestMessagesClone[currentLatestMess].unread_messages! + 1 ?? 0,
                    is_online: chatStatus
                }
            } else {
                const chatStatus = actions.payload?.users?.some((user: any) => user.user_active)
                latestMessagesClone.push({ ...actions.payload, unread_messages: 1, is_online: chatStatus })
            }



            return {
                ...state,
                latestMessages: latestMessagesClone,
                unread_messages: state.unread_messages + 1,
                interactions: interactionsClone
            }
        },

        getUnreadMessages: (state, actions) => { },
        getUnreadMessagesSuccess: (state, actions) => {
            return {
                ...state,
                unread_messages: actions.payload
            }
        },

        getMessagesDetail: (state, actions) => { },

        getMessagesDetailSuccess: (state, actions) => {
            const interactionsClone = [...state.interactions]
            const currentInteraction = interactionsClone?.findIndex((item) => item.id === actions.payload.room_id)
            interactionsClone[currentInteraction] = {...interactionsClone[currentInteraction], messages: [...actions?.payload?.data?.messages?.reverse(), ...interactionsClone[currentInteraction]?.messages]}
            return {
                ...state,
                interactions: interactionsClone
            }
        },

        userAuthenSocket: (state, actions) => {
            let latestMessagesClone = [...state.latestMessages]
            let interactionsClone = [...state.interactions]
            latestMessagesClone = latestMessagesClone?.map((mess) => {
                mess = {
                    ...mess, users: mess.users?.map((u) => {
                        if (u.id === actions.payload.user_id) {
                            return { ...u, user_active: actions.payload.status === 'logout' ? false : true }
                        } else {
                            return { ...u }
                        }
                    })
                }
                return mess
            })
            interactionsClone = interactionsClone?.map((inter) => {
                inter = {
                    ...inter, users: inter.users?.map((u) => {
                        if (u.id === actions.payload.user_id) {
                            return { ...u, user_active: actions.payload.status === 'logout' ? false : true }
                        } else {
                            return { ...u }
                        }
                    })
                }
                return inter
            })
            return {
                ...state,
                latestMessages: latestMessagesClone,
                interactions: interactionsClone
            }
        },

        getRoomDetail: (state, actions) => { },

        seenMessage: (state, actions) => { },
        seenMessageSuccess: (state, actions) => {
            const latestMessageClone = [...state.latestMessages]
            const interactionsClone = [...state.interactions]
            const currentLatestMess = latestMessageClone?.findIndex((mess) => mess.id === actions.payload.room_id)
            const currentInteraction = interactionsClone?.findIndex((item) => item.id === actions.payload.room_id)
            const currentMessItem = latestMessageClone[currentLatestMess].unread_messages
            latestMessageClone[currentLatestMess] = {
                ...latestMessageClone[currentLatestMess], unread_messages: 0, users: latestMessageClone[currentLatestMess]?.users?.map((u) => {
                    if (actions.payload.user_id === u.id) {
                        return { ...u, status_info: { ...u.status_info, message_status: 'seen' } }
                    } else {
                        return u
                    }
                })
            }

            interactionsClone[currentInteraction] = {
                ...interactionsClone[currentInteraction],
                users: interactionsClone[currentInteraction]?.users?.map((u) => {
                    if (u.id === actions.payload.user_id) {
                        return { ...u, status_info: { ...u?.status_info, message_status: 'seen' } }
                    } else {
                        return { ...u }
                    }
                })
            }
            return {
                ...state,
                interactions: interactionsClone,
                latestMessages: latestMessageClone,
                unread_messages: state.unread_messages - currentMessItem!
            }
        }
    })
})

export const InteractionsActions = Interactions.actions;

const InteractionsReducer = Interactions.reducer;
export default InteractionsReducer;