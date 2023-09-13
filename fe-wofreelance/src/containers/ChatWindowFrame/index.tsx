
import { useContext, useState, useRef } from "react";
import { useSelector } from "react-redux";
import dayjs from "dayjs";
import { BellFilled, UpOutlined, FilterOutlined, SearchOutlined } from '@ant-design/icons'
import { Empty, Input } from "antd";
import utc from 'dayjs/plugin/utc';
import timezone from 'dayjs/plugin/timezone';

import { RootState } from "../../reducers/rootReducer";
import { useAppDispatch } from "../../reducers/hook";
import { InteractionsActions } from "../../reducers/listReducer/interactionReducer";

import { InteractionReducer, ResponseFormatItem, UserInterface, latestMessageInterface } from "../../interface";

import { SocketContext } from "../../SocketProvider";
import ChatWindowItem from "./ChatWindowItem";

import './style.scss'
import { renderRoomImage } from "../../utils/helper";

function ChatWindowFrame() {
  const dispatch = useAppDispatch()
  dayjs.extend(utc);
    dayjs.extend(timezone);
  const textareaRef = useRef<any>(null)
  const socket: any = useContext(SocketContext)
  const [viewMessage, setViewMessage] = useState(false)

  const interactions: any = useSelector((state: RootState) => state.interactions.interactions)
  const latestMessages: Array<latestMessageInterface> = useSelector((state: RootState) => state.interactions.latestMessages)
  console.log('interactions', interactions)

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

  const handleOpenChatWindow = (interaction: any) => {

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
              {latestMessages?.length > 0 ? (
                latestMessages?.map((interaction, index) => {
                  const imgReturn = renderRoomImage(interaction?.users, user)
                  return (
                    <div className={`message-item ${interaction?.messages?.message_status}`} key={index} onClick={() => handleOpenChatWindow(interaction)}>
                      <div className="message-item-left">
                        <div className="message-item-avatar">
                          {imgReturn}
                          <div className={`user-status ${interaction?.is_online && 'online'}`}></div>
                        </div>
                        <div className="message-item-infor">
                          <div className="message-item-name">{interaction?.room_name}</div>
                          <div className="message-item-latest">{interaction?.messages?.sender_info?.username === user?.username ? 'You' : interaction?.messages?.sender_info?.username}: {interaction?.messages?.content_text}</div>
                        </div>
                      </div>
                      <div className="message-item-sub-info">
                        <div className="message-item-time-latest">{dayjs(interaction.messages.createdAt).tz('Asia/Ho_Chi_Minh').format('dddd D H:mm')}</div>
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
            <ChatWindowItem interactionItem={item} index={index}/>
          )
        })}
      </div>
    </div>
  );
}

export default ChatWindowFrame;
