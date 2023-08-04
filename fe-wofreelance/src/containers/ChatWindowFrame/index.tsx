import { Routes, Route, Navigate, Outlet, useNavigate, useLocation } from "react-router-dom";

import { useContext, useEffect, useState } from "react";
import { io } from "socket.io-client";
import { useSelector } from "react-redux";

import { BellFilled, UpOutlined, FilterOutlined, SearchOutlined, DashOutlined, ArrowsAltOutlined, PhoneOutlined, CloseOutlined, LinkOutlined, AudioOutlined, SmileOutlined, LikeTwoTone } from '@ant-design/icons'
import './style.scss'
import { Input } from "antd";
import { RootState } from "../../reducers/rootReducer";
import { ChatReducerInterface } from "../../interface";
import { useAppDispatch } from "../../reducers/hook";
import { ChatActions } from "../../reducers/listReducer/chatReducer";
// import { socket } from "./SocketContext";

function ChatWindowFrame() {
  const dispatch = useAppDispatch()
  const [viewMessage, setViewMessage] = useState(false)
  const [listInteractions, setListInteractions] = useState([])
  const interactions: any = useSelector((state: RootState) => state.chat.interactions)


  const handleOpenListMessage = () => {
    setViewMessage(!viewMessage)
  }

  const handleModifyWindowChat = (record: ChatReducerInterface, status: string) => {
    dispatch(ChatActions.modifyInteraction({...record, chat_window_status: status}))
  }

  const handleMoveToProfilePage = (e: any, item: ChatReducerInterface) => {
    e.stopPropagation()
    console.log(item)
  }

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
              <div className="message-item">
                <div className="message-item-left">
                  <div className="message-item-avatar">
                    <img src="https://library.sportingnews.com/styles/crop_style_16_9_desktop_webp/s3/2023-07/Ian%20Maatsen%20Chelsea%20preseason%20071923.jpg.webp?itok=g7PzPfq-" alt="" />
                    <div className={`user-status online`}></div>
                  </div>
                  <div className="message-item-infor">
                    <div className="message-item-name">Kawl C. <span className="email">@linhb18</span></div>
                    <div className="message-item-latest">You: can i help you ?</div>
                  </div>
                </div>
                <div className="message-item-time-latest">6 minutes</div>
              </div>
              <div className="message-item">
                <div className="message-item-left">
                  <div className="message-item-avatar">
                    <img src="https://library.sportingnews.com/styles/crop_style_16_9_desktop_webp/s3/2023-07/Ian%20Maatsen%20Chelsea%20preseason%20071923.jpg.webp?itok=g7PzPfq-" alt="" />
                    <div className={`user-status offline`}></div>
                  </div>
                  <div className="message-item-infor">
                    <div className="message-item-name">Kawl C. <span className="email">@linhb18</span></div>
                    <div className="message-item-latest">You: can i help you ?</div>
                  </div>
                </div>
                <div className="message-item-time-latest">6 minutes</div>
              </div>
              <div className="message-item">
                <div className="message-item-left">
                  <div className="message-item-avatar">
                    <img src="https://library.sportingnews.com/styles/crop_style_16_9_desktop_webp/s3/2023-07/Ian%20Maatsen%20Chelsea%20preseason%20071923.jpg.webp?itok=g7PzPfq-" alt="" />
                    <div className={`user-status online`}></div>
                  </div>
                  <div className="message-item-infor">
                    <div className="message-item-name">Kawl C. <span className="email">@linhb18</span></div>
                    <div className="message-item-latest">You: can i help you ?</div>
                  </div>
                </div>
                <div className="message-item-time-latest">6 minutes</div>
              </div>
              <div className="message-item">
                <div className="message-item-left">
                  <div className="message-item-avatar">
                    <img src="https://library.sportingnews.com/styles/crop_style_16_9_desktop_webp/s3/2023-07/Ian%20Maatsen%20Chelsea%20preseason%20071923.jpg.webp?itok=g7PzPfq-" alt="" />
                    <div className={`user-status offline`}></div>
                  </div>
                  <div className="message-item-infor">
                    <div className="message-item-name">Kawl C. <span className="email">@linhb18</span></div>
                    <div className="message-item-latest">You: can i help you ?</div>
                  </div>
                </div>
                <div className="message-item-time-latest">6 minutes</div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="chat-windows-list">
        {interactions?.map((item: ChatReducerInterface, index: number) => {
          return (
            <div className={`chat-window-item ${item.chat_window_status}`} key={`${item.user.id}${item.message_title}`} style={{right: `${25 * (index + 1.1)}rem`}}>
              <div className="chat-window-item-header">
                <div className="chat-window-header-left" onClick={() => handleModifyWindowChat(item, (item.chat_window_status === 'open' || item.chat_window_status === 'focus') ? 'hidden' : 'focus')}>
                  <div className={`account-status ${item?.user?.user_active ? 'online' : 'offline'}`}></div>
                  <div className="chat-window-header-left-info">
                    <div className="email" onClick={(e) => handleMoveToProfilePage(e, item)}>@{item?.user?.username}</div>
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
              <div className="chat-frame-content" onClick={() => handleModifyWindowChat(item,  'focus')}></div>
              <div className="chat-frame-editor" onClick={() => handleModifyWindowChat(item,  'focus')}>
                <div className="chat-frame-editor-left">
                  <LinkOutlined />
                  <Input.TextArea className="form-input textarea" placeholder="Type a message" />
                </div>
                <div className="chat-frame-editor-right">
                  <AudioOutlined />
                  <SmileOutlined />
                  <LikeTwoTone />
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
