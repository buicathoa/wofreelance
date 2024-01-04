/* eslint-disable array-callback-return */
import { useLocation, useNavigate } from "react-router-dom";
import { BellOutlined, MessageOutlined, CodeSandboxOutlined, TeamOutlined } from '@ant-design/icons'
import { Badge, Button, Popover } from "antd";
import React, { useEffect, useContext, useState, Suspense } from "react";
import { useDispatch, useSelector } from "react-redux";

import { freelancer_logo } from 'assets'
import { InteractionReducer, NotificationInterface, ResponseFormatItem, UserInterface, latestMessageInterface } from "interface";
import { checkLocalStorage, deleteCookie, getCookie } from "utils/helper";
import { modalNotifications } from "components/modalNotifications";
import { SocketContext } from "SocketProvider";
import ChatWindowFrame from "containers/ChatWindowFrame";

import { UserActions } from "reducers/listReducer/userReducer";
import { RootState } from "reducers/rootReducer";
import { NotificationsActions } from "reducers/listReducer/notificationsReducer";
import { InteractionsActions } from "reducers/listReducer/interactionReducer";
import { PostActions } from "reducers/listReducer/postReducer";

import './style.scss'

const BrowseContent = React.lazy(() => import('./BrowseContent'));
const ManageContent = React.lazy(() => import('./ManageContent'));
const GroupContent = React.lazy(() => import('./GroupContent'));
const NotificationContent = React.lazy(() => import('./NotificationContent'));
const MessagesContent = React.lazy(() => import('./MessagesContent'));
const ProfileContent = React.lazy(() => import('./ProfileContent'));

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

  const getUnreadMessages = (param: any): Promise<ResponseFormatItem> => {
    return new Promise((resolve, reject) => {
      dispatch(InteractionsActions.getUnreadMessages({ param, resolve, reject }));
    });
  };

  const user: UserInterface = useSelector((state: RootState) => state.user.user)
  const notifications: Array<NotificationInterface> = useSelector((state: RootState) => state.notifications.notifications)
  const unread_messages: number = useSelector((state: RootState) => state.interactions.unread_messages)
  const latestMessages: Array<latestMessageInterface> = useSelector((state: RootState) => state.interactions.latestMessages)
  const interactions: Array<InteractionReducer> = useSelector((state: RootState) => state.interactions.interactions)

  useEffect(() => {
    if (socket?.connected) {
      if (!checkLocalStorage('access_token')) {
        const nextLocation = location.pathname.replaceAll('/', '%252')
        navigate(`/signin?next=${nextLocation}`)
      } else {
        getUserInfo({}).then((resUser) => {
          getAllLatestMessages(filterLatestMessages).then((res) => {
            getUnreadMessages({})
            dispatch(InteractionsActions.getAllLatestMessagesSuccess({ data: res?.data, currentUser: resUser?.data?.username }))
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
        dispatch(UserActions.increaseNotifications(data))
        modalNotifications(
          {
            notiMess: data.title, description: `Here the latest project matching your skills: ${data.project_detail}\
        ,Skills: ${data.skills.map((skill: any) => {
              return skill.label
            }).join(", ")}`, noti_url: data.noti_url
          })
      });

      socket.on("project_bidding_response", (data: any) => {
        dispatch(UserActions.increaseNotifications(data))
        // dispatch(PostActions.biddingResponse(data))
        return modalNotifications({ notiMess: 'New bidding', description: data.message, noti_url: data.url })
      })

      socket.on("new_message_response", (data: any) => {
        dispatch(InteractionsActions.addNewMessagesReceived(data))
      })

      socket.on("user_authen", (data: any) => {
        dispatch(InteractionsActions.userAuthenSocket(data))
        dispatch(PostActions.userAuthenSocket(data))
      })

      socket.on("seen_message_success", (data: any) => {
        dispatch(InteractionsActions.seenMessageSuccess(data))
      })

      socket.on("award_bid_response", (data: any) => {
        dispatch(UserActions.increaseNotifications(data))
        dispatch(PostActions.awardBidResponse(data))
        return modalNotifications({ notiMess: data?.notification?.noti_title, noti_url: data.notification?.noti_url })
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
      getAllNotifications({ page: 1, limit: 10 }).then(() => {
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
                <Popover content={
                  <Suspense fallback={<p>Loading...</p>}>
                    <BrowseContent />
                  </Suspense>
                } trigger="hover" placement="bottomLeft">
                  <CodeSandboxOutlined />
                  <span>Browse</span>
                </Popover>
              </div>
              <div className="manage-left-item">
                <Popover content={
                  <Suspense fallback={<p>Loading...</p>}>
                    <ManageContent />
                  </Suspense>
                } trigger="hover" placement="bottomLeft">
                  <CodeSandboxOutlined />
                  <span>Manage</span>
                </Popover>
              </div>
              <div className="manage-left-item">
                <Popover content={
                  <Suspense fallback={<p>Loading...</p>}>
                    <GroupContent />
                  </Suspense>
                } trigger="hover" placement="bottomLeft">
                  <TeamOutlined />
                  <span>Groups</span>
                </Popover>
              </div>
            </div>
          </div>
          <div className="nav-menu-right">
            <div className="message-notify">
              <Popover content={
                <Suspense fallback={<p>Loading...</p>}>
                  <NotificationContent notifications={notifications} />
                </Suspense>
              } onOpenChange={handleOpenNoti} open={openNoti} trigger="click" placement="bottom">
                <Badge count={user.noti_count} size="small">
                  <BellOutlined />
                </Badge>
              </Popover>
              <Popover content={
                <Suspense fallback={<p>Loading...</p>}>
                  <MessagesContent visible={openNotiMess} />
                </Suspense>
              } trigger="click" onOpenChange={handleOpenNotiMess} open={openNotiMess} placement="bottom">
                <Badge count={unread_messages} size="small">
                  <MessageOutlined />
                </Badge>
              </Popover>
            </div>
            <div className="post-profile">
              <Button onClick={handlePostProject}>Post a Project</Button>
              <Popover content={
                <Suspense fallback={<p>Loading...</p>}>
                  <ProfileContent user={user} />
                </Suspense>
              } trigger="hover" placement="bottom">
                <div className="user-profile">
                  <img src={user?.avatar_cropped} alt="" />
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