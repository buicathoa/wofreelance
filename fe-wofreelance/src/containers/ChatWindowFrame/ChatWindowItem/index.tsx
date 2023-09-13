import { useContext, useState, useRef } from "react";
import { useSelector } from "react-redux";
import { Input } from "antd";
import { DashOutlined, ArrowsAltOutlined, PhoneOutlined, CloseOutlined, LinkOutlined, AudioOutlined, SmileOutlined, LikeTwoTone } from '@ant-design/icons'

import { RootState } from "../../../reducers/rootReducer";
import { InteractionReducer, ResponseFormatItem, UserInterface } from "../../../interface";
import { useAppDispatch } from "../../../reducers/hook";
import { InteractionsActions } from "../../../reducers/listReducer/interactionReducer";
import { SocketContext } from "../../../SocketProvider";

import './style.scss'
import { PostActions } from "../../../reducers/listReducer/postReducer";

interface ChatWindowItemInterface {
  interactionItem: InteractionReducer,
  index: number
}

function ChatWindowItem({interactionItem, index}: ChatWindowItemInterface) {
  const dispatch = useAppDispatch()
  const textareaRef = useRef<any>(null)
  const socket: any = useContext(SocketContext)
  const [inputValue, setInputValue] = useState('')

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
      message_title: item?.room_title,
      message_title_url: item?.room_url,
      bidding_id: item?.bidding_id,
      room_id: item?.room_id
    }
    sendMessages({ param: payload, interaction_index: index }).then((res) => {
      if (!item.room_id) {
        getLatestMessageOfRoom({
          room_id: res?.data?.id
        }).then((resLatest: any) => {
          dispatch(PostActions.updateBidRoomId({bidding_id: item?.bidding_id, room_id: res?.data?.id}))
          socket.emit("new_message", { room_id: resLatest?.data?.id })
        })
      } else {
        socket.emit("new_message", { room_id: res?.data?.messages?.room_id })
      }
      setInputValue('')
    })
  }

  const handleKeyDown = (event: any) => {
    if (event.keyCode === 13 && !event.shiftKey) {
      event.preventDefault()
    }
  }

  const handleChangeInput = (e: any) => {
    setInputValue(e.target.value)
  }

  const renderWindowChatName = (item: any) => {
    const windowChatName = !item?.room_name ? item?.users?.map((user: any) => user.username).join(' ,') : item?.room_name
    return windowChatName
  }

  return (
    <div key={index} className={`chat-window-item ${interactionItem.chat_window_status}`} style={{ right: `${25 * (index + 1.1)}rem` }}>
      <div className="chat-window-item-wrapper">
        <div className="chat-window-item-header">
          <div className="chat-window-header-left" onClick={() => handleModifyWindowChat(interactionItem, (interactionItem.chat_window_status === 'open' || interactionItem.chat_window_status === 'focus') ? 'hidden' : 'focus')}>
            <div className={`account-status ${interactionItem?.users?.findIndex((u) => u.username !== user.username && u.user_active) !== -1 ? 'online' : 'offline'}`}></div>
            <div className="chat-window-header-left-info">
              <div className="email" onClick={(e) => handleMoveToProfilePage(e, interactionItem)}>{renderWindowChatName(interactionItem)}</div>
              <div className="chat-title">{interactionItem?.room_title}</div>
            </div>
          </div>
          <div className="chat-window-header-right">
            <DashOutlined />
            <ArrowsAltOutlined />
            <PhoneOutlined />
            <CloseOutlined className="close-fram" />
          </div>
        </div>
        <div className="chat-frame-content" onClick={() => handleModifyWindowChat(interactionItem, 'focus')}
        // style={{height: `${formTextHeight === 2 ||formTextHeight === 1.875   ?  formText : (formText - formTextHeight) + 2}rem`}}
        >
          <div className="chat-content-list" style={{ height: (document.querySelector('.chat-frame-content') && document.querySelector('.chat-frame-editor')) ? 307 - document.querySelector('.chat-frame-editor')!.clientHeight : 'auto' }}>
            {interactionItem?.messages?.map((mess, idx) => {
              return (
                <div className={`${mess?.sender_info?.username === user?.username ? 'own-message' : 'other-message'} message-item`} key={mess?.id}>
                  {mess?.sender_info?.username !== user?.username && <img src={mess?.sender_info?.avatar_cropped} className="avatar" alt="" />}
                  <span className="message-content">{mess?.content_text}</span>
                </div>
              )
            })}
          </div>
        </div>
        <div className="chat-frame-editor" onClick={() => handleModifyWindowChat(interactionItem, 'focus')}
        // style={{height: `${formTextHeight}rem`}}
        >
          <div className="chat-frame-editor-left" ref={textareaRef}>
            <LinkOutlined />
            <Input.TextArea
              id={`${interactionItem?.id || index}`}
              autoSize={{ minRows: 1, maxRows: 3 }} className="form-input textarea" placeholder="Type a message"
              onPressEnter={(event) => handlePressEnter(event, interactionItem, index)}
              onChange={handleChangeInput}
              onKeyDown={handleKeyDown}
              value={inputValue}
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
  );
}

export default ChatWindowItem;
