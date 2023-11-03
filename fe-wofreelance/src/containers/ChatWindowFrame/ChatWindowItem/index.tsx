/* eslint-disable react-hooks/exhaustive-deps */
import { useContext, useState, useRef, useEffect, useCallback } from "react";
import { useSelector } from "react-redux";
import { Input, Spin, message } from "antd";
import { DashOutlined, ArrowsAltOutlined, PhoneOutlined, CloseOutlined, LinkOutlined, AudioOutlined, SmileOutlined, LikeTwoTone } from '@ant-design/icons'
import { LoadingOutlined } from '@ant-design/icons';

import { RootState } from "../../../reducers/rootReducer";
import { InteractionReducer, ResponseFormatItem, UserInterface } from "../../../interface";
import { useAppDispatch } from "../../../reducers/hook";
import { InteractionsActions } from "../../../reducers/listReducer/interactionReducer";
import { SocketContext } from "../../../SocketProvider";

import './style.scss'
import { PostActions } from "../../../reducers/listReducer/postReducer";
import _ from "lodash";
import { toggleUserMessState } from "../../../utils/helper";

interface ChatWindowItemInterface {
  interactionItem: InteractionReducer,
  index: number
}

function ChatWindowItem({ interactionItem, index }: ChatWindowItemInterface) {
  const dispatch = useAppDispatch()
  const windowRef = useRef<any>(null)
  const scrollviewRef = useRef<any>(null)
  const socket: any = useContext(SocketContext)
  const [inputValue, setInputValue] = useState('')
  const [windowItemSelected, setwindowItemSelected] = useState<any>({})
  const [isGetNewMessage, setIsGetNewMessage] = useState(false)
  const [currentPage, setCurrentPage] = useState(1)


  const antIcon = <LoadingOutlined style={{ fontSize: 24 }} spin />;


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

  const seenMessage = (param: any): Promise<ResponseFormatItem> => {
    return new Promise((resolve, reject) => {
      dispatch(InteractionsActions.seenMessage({ param, resolve, reject }));
    });
  };

  const getMessagesDetail = (param: any): Promise<ResponseFormatItem> => {
    return new Promise((resolve, reject) => {
      dispatch(InteractionsActions.getMessagesDetail({ param, resolve, reject }));
    });
  };

  useEffect(() => {
    if (interactionItem && !_.isEmpty(windowItemSelected)) {
      if (interactionItem?.messages[0]?.sender_info?.id !== user?.id) {
        const lastMessState = toggleUserMessState(interactionItem, user.id!)
        if (lastMessState === 'received' && interactionItem?.chat_window_status === 'focus') {
          seenMessage({ room_id: windowItemSelected.id, user_id: user.id }).then(() => {
            socket.emit('seen_message', { room_id: windowItemSelected.id, user_id: user.id })
          })
        }
      }
    }
  }, [interactionItem?.messages?.length])

  useEffect(() => {
    scrollviewRef.current.scrollTo(0, document.body.scrollHeight);
    window.onclick = (event: any) => {
      if (!windowRef?.current?.contains(event?.target)) {
        setwindowItemSelected({})
      } else {
        console.log(`You clicked Inside the box!`);
      }
    }
  }, []);

  const handleModifyWindowChat = (record: InteractionReducer, status: string) => {
    setwindowItemSelected(record)
    dispatch(InteractionsActions.modifyInteraction({ ...record, chat_window_status: status }))
    const messState = toggleUserMessState(record, user.id!)
    if (messState === 'received' && record?.id) {
      seenMessage({ room_id: record.id, user_id: user.id }).then(() => {
        socket.emit('seen_message', { room_id: record.id, user_id: user.id })
      })
    }
  }

  const handleMoveToProfilePage = (e: any, item: InteractionReducer) => {
    e.stopPropagation()
  }

  const handlePressEnter = (event: any, item: InteractionReducer, index: number) => {
    const listReceivers = item?.users?.map((user) => user.id)
    const payload = {
      content_type: 'text',
      content_text: event.target.value,
      receivers: listReceivers,
      message_title: item?.room_title,
      message_title_url: item?.room_url,
      bidding_id: item?.bidding_id,
      room_id: item?.room_id
    }
    sendMessages(payload).then((res) => {
      if (!item.room_id) {
        getLatestMessageOfRoom({
          room_id: res?.data?.id
        }).then((resLatest: any) => {
          socket.emit("new_message", { room_id: resLatest?.data?.id })
          dispatch(PostActions.updateBidRoomId({ bidding_id: item?.bidding_id, room_id: res?.data?.id }))
        })
      }
      else {
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
    const windowChatName = !item?.room_name ? item?.users?.filter((u: any) => u.id !== user.id)?.map((user: any) => user.username).join(' ,') : item?.room_name
    return windowChatName
  }

  const renderMessageSeenStatus = (idx: number) => {
    let htmlReturn: any = <div></div>
    if (interactionItem?.users.length > 0) {
      const lastMessState = interactionItem?.users?.filter((u: any) => u.id !== user.id && u?.status_info?.message_status === 'seen')
      if (lastMessState?.length > 0) {
        htmlReturn = lastMessState?.map((mess) => {
          return <img src={mess?.avatar_cropped} alt="" />
        })
      }
    }
    return htmlReturn
  }

  const handleCloseInteraction = (idx: number) => {
    dispatch(InteractionsActions.closeInteraction(idx))
  }

  const handleScroll = (e: any) => {
    if (e.target.scrollTop === 0 && interactionItem?.messages.length < interactionItem?.total!) {
      const pageMessage = currentPage + 1
      setCurrentPage(pageMessage)
      setIsGetNewMessage(true)

      const skipMess = interactionItem?.total! % interactionItem?.messages?.length
      const payload = {
        page: pageMessage,
        limit: 10,
        skip: skipMess,
        search_list: [
          {
            name_field: "room_id",
            value_search: interactionItem?.id
          }
        ]
      }
      getMessagesDetail(payload).then(() => {
        setIsGetNewMessage(false)
        scrollviewRef.current.scrollTo(0, 50)
      })
    }
  }

  return (
    <div key={index} ref={windowRef} className={`chat-window-item ${interactionItem.chat_window_status}`} style={{ right: `${25 * (index + 1.1)}rem` }}>
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
            <CloseOutlined className="close-fram" onClick={() => handleCloseInteraction(index)} />
          </div>
        </div>

        <div className="chat-frame-content" id={`chat-frame-content-${index}`} onClick={() => handleModifyWindowChat(interactionItem, 'focus')}>
          <Spin indicator={antIcon} spinning={isGetNewMessage} />
          <div ref={scrollviewRef} className={`chat-content-list ${isGetNewMessage && 'get-new'}`} onScroll={(e) => handleScroll(e)}>
            {interactionItem?.messages?.map((mess, idx) => {
              return (
                <div className={`${mess?.sender_info?.username === user?.username ? 'own-message' : 'other-message'} message-item`} key={mess?.id}>
                  {mess?.sender_info?.username !== user?.username && <img src={mess?.sender_info?.avatar_cropped} className="avatar" alt="" />}
                  <span className="message-content">{mess?.content_text}</span>
                  <div className="last-message-status">
                    {(idx + 1 === interactionItem?.messages?.length && mess?.sender_info?.id === user?.id) && renderMessageSeenStatus(idx)}
                  </div>
                </div>
              )
            })}
          </div>
        </div>
        <div className="chat-frame-editor" onClick={() => handleModifyWindowChat(interactionItem, 'focus')}
        // style={{height: `${formTextHeight}rem`}}
        >
          <div className="chat-frame-editor-left">
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
