import React, { useState, useEffect } from 'react'
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
import { renderRoomImage } from '../../../utils/helper'
interface MessagesContentInterface {
    visible: boolean
}

const MessagesContent = ({ visible }: MessagesContentInterface) => {
    const dispatch = useDispatch()
    dayjs.extend(utc);
    dayjs.extend(timezone);
    const [messages, setMessages] = useState<Array<latestMessageInterface>>([])
    const [personalRoomName, setPersonalRoomName] = useState('')
    const latestMessages: Array<latestMessageInterface> = useSelector((state: RootState) => state.interactions.latestMessages)

    console.log('latestMessages', latestMessages)

    const getMessagesDetail = (param: any): Promise<ResponseFormatItem> => {
        return new Promise((resolve, reject) => {
          dispatch(InteractionsActions.getMessagesDetail({ param, resolve, reject }));
        });
      };

    const user: UserInterface = useSelector((state: RootState) => state.user.user)
    

    const handleOpenInteraction = (item: any) => {
        const payload = {
            page: 1, 
            limit: 10,
            search_list: [
                {
                    name_field: "room_id",
                    value_search: item.id
                }
            ]
        }
        getMessagesDetail(payload).then((res: any) => {
            dispatch(InteractionsActions.addInteraction({ ...item, chat_window_status: 'open', room_id: item.id, messages: res?.data }))
        })
        // debugger
    }

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
                            let active = false
                            const indexOnline = interaction?.users?.filter((u) => u.username !== user?.username)?.findIndex(u => u.user_active)
                            if(indexOnline !== -1) {
                                active = true
                            } else {
                                active = false
                            }
                            return (
                                <div className="message-item" key={index} onClick={() => handleOpenInteraction(interaction)}>
                                    <div className="avatar">
                                        {imgReturn}
                                    </div>
                                    <div className="message-item-content">
                                        <div className="sender-info">
                                            <div className={`sender-name`}>{interaction.room_name}{interaction?.unread_messages !== 0 && <span className="count-unread">{interaction?.unread_messages}</span>}</div>
                                            <div className="message-latest-time">{dayjs(interaction.messages.createdAt).tz('Asia/Ho_Chi_Minh').format('dddd D H:mm')}</div>
                                        </div>
                                        <div className="message-info">
                                            <div className={`message-context ${interaction?.messages?.message_status}`}>{interaction?.messages?.sender_info?.username === user?.username ? 'You' : interaction?.messages?.sender_info?.username}:  {interaction?.messages?.content_text}</div>
                                            <div className={`message-status ${interaction?.messages?.message_status}`}></div>
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
