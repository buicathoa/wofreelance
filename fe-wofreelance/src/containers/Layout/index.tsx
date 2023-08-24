/* eslint-disable array-callback-return */
import { Outlet, useLocation, useNavigate, useParams } from "react-router-dom";
import { freelancer_logo } from '../../assets'
import { BellOutlined, MessageOutlined, CodeSandboxOutlined, TeamOutlined } from '@ant-design/icons'
import { Badge, Button, Popover } from "antd";
import './style.scss'
import { useEffect, useContext, useState } from "react";
import { useDispatch } from "react-redux";
import { InteractionReducer, NotificationInterface, ResponseFormatItem, UserInterface, latestMessageInterface } from "../../interface";
import { UserActions } from "../../reducers/listReducer/userReducer";
import { useSelector } from "react-redux";
import { RootState } from "../../reducers/rootReducer";
import BrowseContent from "./BrowseContent";
import ManageContent from "./ManageContent";
import GroupContent from "./GroupContent";
import NotificationContent from "./NotificationContent";
import MessagesContent from "./MessagesContent";
import ProfileContent from "./ProfileContent";
import { checkLocalStorage, deleteCookie, getCookie } from "../../utils/helper";
import { modalNotifications } from "../../components/modalNotifications";
import { SocketContext } from "../../SocketProvider";
import { NotificationsActions } from "../../reducers/listReducer/notificationsReducer";
import ChatWindowFrame from "../ChatWindowFrame";
import { InteractionsActions } from "../../reducers/listReducer/interactionReducer";
import { messageStorage } from "../../constants";
// import { socket } from "../../SocketContext";
// import { SocketContext } from "../../SocketContext";


const Layout = () => {
  const initFilterData = {
    page: 1,
    limit: 5,
    search_list: [],
    sorts: []
  }
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const location = useLocation()
  const [openNoti, setOpenNoti] = useState(false)
  const [countMessagesNoti, setCountMessagesNoti] = useState(0)
  const [openNotiMess, setOpenNotiMess] = useState(false)
  const [filterLatestMessages, setFilterLatestMessages] = useState(initFilterData)
  // const socket = useContext(SocketContext)
  const socket: any = useContext(SocketContext)
  const getUserInfo = (param: any): Promise<ResponseFormatItem> => {
    return new Promise((resolve, reject) => {
      dispatch(UserActions.getUserInfo({ param, resolve, reject }));
    });
  };

  const getAllNotifications = (param: any): Promise<ResponseFormatItem> => {
    return new Promise((resolve, reject) => {
      dispatch(NotificationsActions.getAllNotifications({ param, resolve, reject }));
    });
  };

  const updateUser = (param: any): Promise<ResponseFormatItem> => {
    return new Promise((resolve, reject) => {
      dispatch(UserActions.updateUser({ param, resolve, reject }));
    });
  };

  const getAllLatestMessages = (param: any): Promise<ResponseFormatItem> => {
    return new Promise((resolve, reject) => {
      dispatch(InteractionsActions.getAllLatestMessages({ param, resolve, reject }));
    });
  };

  const user: UserInterface = useSelector((state: RootState) => state.user.user)
  const notifications: Array<NotificationInterface> = useSelector((state: RootState) => state.notifications.notifications)
  const unread_messages: number = useSelector((state: RootState) => state.interactions.unread_messages)
  const latestMessages: Array<latestMessageInterface> = useSelector((state: RootState) => state.interactions.latestMessages)
  const interactions: Array<InteractionReducer> = useSelector((state: RootState) => state.interactions.interactions)

  console.log('interactions', interactions)
  useEffect(() => {
    if (socket?.connected) {
      if (!checkLocalStorage('access_token')) {
        const nextLocation = location.pathname.replaceAll('/', '%252')
        navigate(`/signin?next=${nextLocation}`)
      } else {
        getUserInfo({}).then((resUser) => {
          getAllLatestMessages(filterLatestMessages).then((res) => {
            dispatch(InteractionsActions.getAllLatestMessagesSuccess({messages: res.data, currentUser: resUser?.data?.usernames}))
          })
        })
      }
    } else {
      const userTokenCookie: any = getCookie('access_token')
      if (userTokenCookie) {
        localStorage.setItem('access_token', userTokenCookie)
        getUserInfo({})
        deleteCookie('access_token')
      }
    }
  }, [location, socket])

  useEffect(() => {
    if (socket?.connected) {
      socket.on("new_post_notify_response", (data: any) => {
        dispatch(UserActions.increaseNotifications({}))
        modalNotifications(
          {
            notiMess: data.title, description: `Here the latest project matching your skills: ${data.project_detail}\
        ,Skills: ${data.skills.map((skill: any) => {
              return skill.label
            }).join(", ")}`, noti_url: data.noti_url
          })
      });
      socket.on("project_bidding_response", (data: any) => {
        dispatch(UserActions.increaseNotifications({}))
        return modalNotifications({ notiMess: 'New bidding', description: data.message, noti_url: data.url })
      })
      socket.on("new_message_response", (data: any) => {
        const idxLatestMess = latestMessages.findIndex((mess) => mess.id === data.id)
        console.log('interactions_ne', interactions)
        const idxInteractions = interactions.findIndex((item: any) => item.room_id === data.id)
        dispatch(InteractionsActions.sendMessagesSuccess({...data, interaction_state: idxLatestMess === -1 ? 'create' : 'update', interaction_index: idxInteractions}))
      })
    }
  }, [socket])

  const handlePostProject = () => {
    navigate('/post-project')
  }

  const handleOpenNoti = () => {
    if (openNoti) {
      setOpenNoti(false)
    } else {
      getAllNotifications({}).then(() => {
        if (user.noti_count! > 0) {
          updateUser({ noti_count: 0 }).then(() => {
            dispatch(UserActions.updateNoticountSuccess({}))
            setOpenNoti(true)
          })
        } else {
          setOpenNoti(true)
        }
      })
    }
  }

  const handleOpenNotiMess = (open: boolean) => {
    setOpenNotiMess(open)
  }

  return (
    <div>
      <ChatWindowFrame />
      {/* A "layout route" is a good place to put markup you want to
            share across all the pages on your site, like navigation. */}
      <nav className="nav-bar top">
        <div className="nav-bar-top">
          <div className="nav-menu-left">
            <div className="logo">
              <img src={freelancer_logo} alt="" />
            </div>
            <div className="manage-left">
              <div className="manage-left-item">
                <Popover content={<BrowseContent />} trigger="hover" placement="bottomLeft">
                  <CodeSandboxOutlined />
                  <span>Browse</span>
                </Popover>
              </div>
              <div className="manage-left-item">
                <Popover content={<ManageContent />} trigger="hover" placement="bottomLeft">
                  <CodeSandboxOutlined />
                  <span>Manage</span>
                </Popover>
              </div>
              <div className="manage-left-item">
                <Popover content={<GroupContent />} trigger="hover" placement="bottomLeft">
                  <TeamOutlined />
                  <span>Groups</span>
                </Popover>
              </div>
            </div>
          </div>
          <div className="nav-menu-right">
            <div className="message-notify">
              <Popover content={<NotificationContent notifications={notifications} />} onOpenChange={handleOpenNoti} open={openNoti} trigger="click" placement="bottom">
                <Badge count={user.noti_count} size="small">
                  <BellOutlined />
                </Badge>
              </Popover>
              <Popover content={<MessagesContent visible={openNotiMess}/>} trigger="click" onOpenChange={handleOpenNotiMess} open={openNotiMess} placement="bottom">
                <Badge count={unread_messages} size="small">
                  <MessageOutlined />
                </Badge>
              </Popover>
            </div>
            <div className="post-profile">
              <Button onClick={handlePostProject}>Post a Project</Button>
              <Popover content={<ProfileContent user={user} />} trigger="hover" placement="bottom">
                <div className="user-profile">
                  <img src={user?.avatar} alt="" />
                  <div className="name-balance">
                    <div className="name">@{user.username}</div>
                    <div className="balance">
                      $0.00USD
                    </div>
                  </div>
                </div>
              </Popover>
            </div>
          </div>
        </div>
      </nav>

      {/* An <Outlet> renders whatever child route is currently active,
            so you can think about this <Outlet> as a placeholder for
            the child routes we defined above. */}
      {/* <Outlet /> */}
    </div>
  );
}

export default Layout