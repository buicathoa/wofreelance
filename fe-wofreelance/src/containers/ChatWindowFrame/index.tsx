import { Routes, Route, Navigate, Outlet, useNavigate, useLocation } from "react-router-dom";

import { useContext, useEffect, useState, useRef } from "react";
import { io } from "socket.io-client";
import { useSelector } from "react-redux";

import { BellFilled, UpOutlined, FilterOutlined, SearchOutlined, DashOutlined, ArrowsAltOutlined, PhoneOutlined, CloseOutlined, LinkOutlined, AudioOutlined, SmileOutlined, LikeTwoTone } from '@ant-design/icons'
import './style.scss'
import { Empty, Input } from "antd";
import { RootState } from "../../reducers/rootReducer";
import { InteractionReducer, ResponseFormatItem, UserInterface, latestMessageInterface } from "../../interface";
import { useAppDispatch } from "../../reducers/hook";
import { InteractionsActions } from "../../reducers/listReducer/interactionReducer";
import { SocketContext } from "../../SocketProvider";
import dayjs from "dayjs";
// import { socket } from "./SocketContext";

function ChatWindowFrame() {
  const dispatch = useAppDispatch()
  const windowoRef = useRef(-1)
  const socket: any = useContext(SocketContext)
  const [viewMessage, setViewMessage] = useState(false)
  const [listInteractions, setListInteractions] = useState<Array<latestMessageInterface>>([])
  const [formTextHeight, setformTextHeight] = useState(2)
  const [formText, setformText] = useState(22.125)
  const interactions: any = useSelector((state: RootState) => state.interactions.interactions)
  const latestMessages: Array<latestMessageInterface> = useSelector((state: RootState) => state.interactions.latestMessages)
  console.log('latestMessages', latestMessages)
  const user: UserInterface = useSelector((state: RootState) => state.user.user)


  const sendMessages = (param: any): Promise<ResponseFormatItem> => {
    return new Promise((resolve, reject) => {
      dispatch(InteractionsActions.sendMessages({ param, resolve, reject }));
    });
  };

  const getLatestMessageOfRoom = (param: any): Promise<ResponseFormatItem> => {
    return new Promise((resolve, reject) => {
      dispatch(InteractionsActions.getLatestMessageOfRoom({ param, resolve, reject }));
    });
  };

  const handleOpenListMessage = () => {
    setViewMessage(!viewMessage)
  }

  const handleModifyWindowChat = (record: InteractionReducer, status: string) => {
    dispatch(InteractionsActions.modifyInteraction({ ...record, chat_window_status: status }))
  }

  const handleMoveToProfilePage = (e: any, item: InteractionReducer) => {
    e.stopPropagation()
    console.log(item)
  }

  const handlePressEnter = (event: any, item: InteractionReducer, index: number) => {
    const listReceivers = item.users.map((user) => user.id)
    const payload = {
      content_type: 'text',
      content_text: event.target.value,
      receivers: listReceivers,
      message_title: item?.message_title,
      message_title_url: item?.message_url,
      bidding_id: item?.bidding_id,
      room_id: item?.room_id
    }
    console.log(event.target.value)
    sendMessages(payload).then((res) => {
      if(!item.room_id) {
        getLatestMessageOfRoom({
          room_id: res?.data?.id,
          currentUser: user.username,
          interaction_index: index
        })
      }
    })
  }

  const handleKeyDown = (event: any) => {
    if (event.keyCode === 13 && !event.shiftKey) {
      event.preventDefault()
    }
  }

  const handleChangeInput = (event: any) => {
    var limit = 80;
    const textArea = Math.min(event.target.scrollHeight, limit) / 16
    console.log(event.target.scrollTop)
    console.log('textArea', textArea)
    setformTextHeight(textArea)
  }

  const renderWindowChatName = (users: Array<UserInterface>) => {
    const windowChatName = users?.map((user) => user.last_name).join(' ,')
    return windowChatName
  }

  const handleOpenChatWindow = (interaction: any) => {

  }

  const onFocusCapture = (index:number) => {
    windowoRef.current = index
  }

  const handleBlur = () => {
    windowoRef.current = -1
  }

  console.log('windowoRef::', windowoRef.current)


  console.log('interactions', interactions)

  return (
    <div className="chat-frame">
      <div className={`list-messages ${viewMessage ? 'open' : 'hidden'}`}>
        <div className="list-messages-header" onClick={handleOpenListMessage}>
          <div className="title">Messages</div>
          <div className="list-messages-header-button">
            <BellFilled />
            <UpOutlined />
          </div>
        </div>
        <div className={`list-messages-container`}>
          <div className="list-messages-container-header custom-form-item">
            <Input placeholder="Search" className="form-input" prefix={<SearchOutlined />} />
            <FilterOutlined />
          </div>
          <div className="list-messages-items">
            <div className="list-messages-items-top">
              <span>Chats</span>
              <span>Requests</span>
            </div>
            <div className="list-messages-main">
              {latestMessages?.length > 0 ? (
                latestMessages?.map((interaction, index) => {
                  return (
                    <div className={`message-item ${interaction?.messages?.message_status}`} key={index} onClick={() => handleOpenChatWindow(interaction)}>
                      <div className="message-item-left">
                        <div className="message-item-avatar">
                          <img src="https://library.sportingnews.com/styles/crop_style_16_9_desktop_webp/s3/2023-07/Ian%20Maatsen%20Chelsea%20preseason%20071923.jpg.webp?itok=g7PzPfq-" alt="" />
                          <div className={`user-status ${interaction?.is_online && 'online'}`}></div>
                        </div>
                        <div className="message-item-infor">
                          <div className="message-item-name">{interaction?.room_name}</div>
                          <div className="message-item-latest">{interaction?.messages?.sender_info?.username === user?.username ? 'You' : interaction?.messages?.sender_info?.username}: {interaction?.messages?.content_text}</div>
                        </div>
                      </div>
                      <div className="message-item-sub-info">
                        <div className="message-item-time-latest">{dayjs(interaction.createdAt).format('dddd D H:mm')}</div>
                        <div className="message-item-status"></div>
                      </div>
                    </div>
                  )
                })
              ) :
                <Empty />
              }
            </div>
          </div>
        </div>
      </div>
      <div className="chat-windows-list">
        {interactions?.map((item: InteractionReducer, index: number) => {
          return (
            <div className={`chat-window-item ${item.chat_window_status}`} key={index} style={{ right: `${25 * (index + 1.1)}rem` }}>
              <div className="chat-window-item-wrapper">
                <div className="chat-window-item-header">
                  <div className="chat-window-header-left" onClick={() => handleModifyWindowChat(item, (item.chat_window_status === 'open' || item.chat_window_status === 'focus') ? 'hidden' : 'focus')}>
                    <div className={`account-status ${item?.users?.filter((user) => user.user_active).length > 0 ? 'online' : 'offline'}`}></div>
                    <div className="chat-window-header-left-info">
                      <div className="email" onClick={(e) => handleMoveToProfilePage(e, item)}>{renderWindowChatName(item?.users)}</div>
                      <div className="chat-title">{item?.message_title}</div>
                    </div>
                  </div>
                  <div className="chat-window-header-right">
                    <DashOutlined />
                    <ArrowsAltOutlined />
                    <PhoneOutlined />
                    <CloseOutlined className="close-fram" />
                  </div>
                </div>
                <div className="chat-frame-content" onClick={() => handleModifyWindowChat(item, 'focus')}
                // style={{height: `${formTextHeight === 2 ||formTextHeight === 1.875   ?  formText : (formText - formTextHeight) + 2}rem`}}
                ></div>
                <div className="chat-frame-editor" onClick={() => handleModifyWindowChat(item, 'focus')}
                // style={{height: `${formTextHeight}rem`}}
                >
                  <div className="chat-frame-editor-left">
                    <LinkOutlined />
                    <Input.TextArea
                      autoSize={{ minRows: 1, maxRows: 10 }} className="form-input textarea" placeholder="Type a message"
                      onPressEnter={(event) => handlePressEnter(event, item, index)}
                      onKeyDown={handleKeyDown}
                      onChange={handleChangeInput}
                      onFocusCapture={() => onFocusCapture(index)}
                      onBlur={handleBlur}
                    />
                  </div>
                  <div className="chat-frame-editor-right">
                    <AudioOutlined />
                    <SmileOutlined />
                    <LikeTwoTone />
                  </div>
                </div>
              </div>
            </div>
          )
        })}
      </div>
    </div>
  );
}

export default ChatWindowFrame;
