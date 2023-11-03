import React, { useState, useEffect, useContext, useMemo, useCallback } from 'react'
import { live_chat } from '../../../assets'

import './style.scss'
import { Link } from 'react-router-dom'
import { InteractionReducer, ResponseFormatItem, UserInterface, latestMessageInterface } from '../../../interface'
import { RootState } from '../../../reducers/rootReducer'
import { useSelector } from 'react-redux'
import { messageStorage } from '../../../constants'
import dayjs from 'dayjs'
import { useDispatch } from 'react-redux'
import { InteractionsActions } from '../../../reducers/listReducer/interactionReducer'
import axios from 'axios'
import utc from 'dayjs/plugin/utc';
import timezone from 'dayjs/plugin/timezone';
import { renderRoomImage, toggleUserMessState } from '../../../utils/helper'
import { SocketContext } from '../../../SocketProvider'
interface MessagesContentInterface {
    visible: boolean
}

const MessagesContent = ({ visible }: MessagesContentInterface) => {
    const dispatch = useDispatch()
    dayjs.extend(utc);
    dayjs.extend(timezone);
    const latestMessages: Array<latestMessageInterface> = useSelector((state: RootState) => state.interactions.latestMessages)
    const interactions: Array<InteractionReducer> = useSelector((state: RootState) => state.interactions.interactions)
    const socket: any = useContext(SocketContext)

    const getMessagesDetail = (param: any): Promise<ResponseFormatItem> => {
        return new Promise((resolve, reject) => {
            dispatch(InteractionsActions.getMessagesDetail({ param, resolve, reject }));
        });
    };

    const seenMessage = (param: any): Promise<ResponseFormatItem> => {
        return new Promise((resolve, reject) => {
            dispatch(InteractionsActions.seenMessage({ param, resolve, reject }));
        });
    };

    const user: UserInterface = useSelector((state: RootState) => state.user.user)


    const handleOpenInteraction = (item: any) => {
        const payload = {
            page: 1,
            limit: 10,
            skip: 0,
            search_list: [
                {
                    name_field: "room_id",
                    value_search: item.id
                }
            ]
        }
        getMessagesDetail(payload).then((res: any) => {
            dispatch(InteractionsActions.addInteraction({ ...item, chat_window_status: 'open', room_id: item.id, messages: res?.data?.messages.reverse(), total: res?.data?.total }))
            const messState = toggleUserMessState(item, user.id!)
            if (messState === 'received') {
                seenMessage({room_id: item.id, user_id: user.id}).then(() => {
                    socket.emit('seen_message', { room_id: item.id, user_id: user.id })
                })
                // dispatch(InteractionsActions.seenMessageSuccess({ room_id: item.id, user_id: user.id }))
            }
        })
    }

    // const renderRoomName = (interaction: any) => {
    //     let roomName = ''
    //     if(interaction?.room_title) {
    //         if(interaction?.room_title?.length > 16) {
    //             roomName = `${interaction.room_title?.slice(0, 16)}...`
    //         } else {
    //             roomName = interaction?.room_title
    //         }
    //     } else {
    //         if(interaction?.room_name) {
    //             if(interaction?.room_name?.length > 16) {
    //                 roomName = `${interaction.room_name?.slice(0, 16)}...`
    //             } else {
    //                 roomName = interaction?.room_name
    //             }
    //         }
    //     }
    //     return roomName
    // }

    const renderRoomName = useCallback((interaction: any) => {
        let roomName = ''
        if(interaction?.room_title) {
            if(interaction?.room_title?.length > 16) {
                roomName = `${interaction.room_title?.slice(0, 16)}...`
            } else {
                roomName = interaction?.room_title
            }
        } else {
            if(interaction?.room_name) {
                if(interaction?.room_name?.length > 16) {
                    roomName = `${interaction.room_name?.slice(0, 16)}...`
                } else {
                    roomName = interaction?.room_name
                }
            }
        }
        return roomName
      }, [latestMessages]);

    return (
        <div className="message-content-wrapper">
            <div className="message-content-header">
                <div className="title">Recent Messages</div>
                <Link to="#"><div className="view-all">View all</div></Link>
            </div>
            <div className="message-content-main">
                {latestMessages.length === 0 ?
                    <div className="message-content-empty">
                        <div className="message-content-empty-image">
                            <img src={live_chat} alt="" />
                        </div>
                        <div className="message-content-empty-text">
                            Start connecting with others by <Link to="#">browsing</Link> or <Link to="#">posting a project</Link>
                        </div>
                    </div> : <div className="messages-list">
                        {latestMessages?.map((interaction, index) => {
                            const imgReturn = renderRoomImage(interaction?.users, user)
                            const roomStatus = interaction?.users
                                ?.filter((item) => item.username !== user.username)
                                ?.some((item) => item.user_active)
                            const userFound = interaction?.users?.find((u) => u.id === user.id)
                            return (
                                <div className="message-item" key={index} onClick={() => handleOpenInteraction(interaction)}>
                                    <div className="avatar">
                                        {imgReturn}
                                        <span className={`room-status ${roomStatus ? 'online' : 'offline'}`}></span>
                                    </div>
                                    <div className="message-item-content">
                                        <div className="sender-info">
                                            <div className={`sender-name`}>
                                            {renderRoomName(interaction)}
                                            {interaction?.unread_messages !== 0 && <span className="count-unread">{interaction?.unread_messages}</span>}</div>
                                            <div className="message-latest-time">{dayjs(interaction.messages.createdAt).tz('Asia/Ho_Chi_Minh').format('dddd D H:mm')}</div>
                                        </div>
                                        <div className="message-info">
                                            <div className={`message-context ${userFound?.status_info?.message_status}`}>{interaction?.messages?.sender_info?.username === user?.username ? 'You' : interaction?.messages?.sender_info?.username}:  {interaction?.messages?.content_text}</div>
                                            <div className={`message-status ${userFound?.status_info?.message_status}`}></div>
                                        </div>
                                    </div>
                                </div>
                            )
                        })}
                    </div>
                }
            </div>
        </div>
    )
}

export default MessagesContent
