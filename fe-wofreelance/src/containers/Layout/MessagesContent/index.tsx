import React, { useState, useEffect } from 'react'
import { live_chat } from '../../../assets'

import './style.scss'
import { Link } from 'react-router-dom'
import { UserInterface, latestMessageInterface } from '../../../interface'
import { RootState } from '../../../reducers/rootReducer'
import { useSelector } from 'react-redux'
import { messageStorage } from '../../../constants'
import dayjs from 'dayjs'

interface MessagesContentInterface {
    visible: boolean
}

const MessagesContent = ({visible}: MessagesContentInterface) => {
    const [messages, setMessages] = useState<Array<latestMessageInterface>>([])
    const [personalRoomName, setPersonalRoomName] = useState('')
    const latestMessages: Array<latestMessageInterface> = useSelector((state: RootState) => state.interactions.latestMessages)

    const user: UserInterface = useSelector((state: RootState) => state.user.user)
    useEffect(() => {
        if(visible) {
            const messagesClone = latestMessages?.map((message) => {
                console.log(user)
                const roomNameArray = message.room_name?.split(',')
                const roomNameNew = roomNameArray?.map((item) => {
                    if(item.trim() !== user.username && item !== '') {
                        return item.trim()
                    }
                })?.filter((item) => item)?.join(',')
                return {
                    ...message,
                    room_name: roomNameNew,

                }
            })
            setMessages(messagesClone)
        }
    }, [visible])



    console.log('latestMessages', latestMessages)
    return (
        <div className="message-content-wrapper">
            <div className="message-content-header">
                <div className="title">Recent Messages</div>
                <Link to="#"><div className="view-all">View all</div></Link>
            </div>
            <div className="message-content-main">
                {messages.length === 0 ?
                    <div className="message-content-empty">
                        <div className="message-content-empty-image">
                            <img src={live_chat} alt="" />
                        </div>
                        <div className="message-content-empty-text">
                            Start connecting with others by <Link to="#">browsing</Link> or <Link to="#">posting a project</Link>
                        </div>
                    </div> : <div className="messages-list">
                        {messages?.map((interaction, index) => {
                        return (
                            <div className="message-item" key={index}>
                            <div className="avatar">
                                <img src="https://pyxis.nymag.com/v1/imgs/51b/28a/622789406b8850203e2637d657d5a0e0c3-avatar-rerelease.1x.rsquare.w1400.jpg" alt="" />
                            </div>
                            <div className="message-item-content">
                                <div className="sender-info">
                                    <div className={`sender-name`}>{interaction.room_name}</div>
                                    <div className="message-latest-time">{dayjs(interaction.createdAt).format('dddd D H:mm')}</div>
                                </div>
                                <div className="message-info">
                                    <div className={`message-context ${interaction?.messages?.message_status}`}>{interaction?.messages?.content_text}</div>
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
