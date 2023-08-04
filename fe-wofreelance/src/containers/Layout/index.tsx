import { Outlet, useLocation, useNavigate, useParams } from "react-router-dom";
import { freelancer_logo } from '../../assets'
import { BellOutlined, MessageOutlined, CodeSandboxOutlined, TeamOutlined } from '@ant-design/icons'
import { Badge, Button, Popover } from "antd";
import './style.scss'
import { useEffect, useContext, useState } from "react";
import { useDispatch } from "react-redux";
import { NotificationInterface, ResponseFormatItem, UserInterface } from "../../interface";
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
import { ExperienceActions } from "../../reducers/listReducer/experienceReducer";
import { CategoryActions } from "../../reducers/listReducer/categoryReducer";
import { EducationActions } from "../../reducers/listReducer/educationReducer";
import { QualifycationActions } from "../../reducers/listReducer/qualificationReducer";
import Footer from "../Footer";
import { PortfolioActions } from "../../reducers/listReducer/portfolioReducer";
// import { SocketContext } from "../../SocketContext";
import { AppActions } from "../../reducers/listReducer/appReducer";
import { modalNotifications } from "../../components/modalNotifications";
import { SocketContext } from "../../SocketProvider";
import { NotificationsActions } from "../../reducers/listReducer/notificationsReducer";
// import { socket } from "../../SocketContext";
// import { SocketContext } from "../../SocketContext";


const Layout = () => {
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const location = useLocation()
  const [openNoti, setOpenNoti] = useState(false)
  // const socket = useContext(SocketContext)
  const socket: any = useContext(SocketContext)
  const getUserInfo = (param: any): Promise<ResponseFormatItem> => {
    return new Promise((resolve, reject) => {
      dispatch(UserActions.getUserInfo({ param, resolve, reject }));
    });
  };

  const getUserInfoDestination = (param: any): Promise<ResponseFormatItem> => {
    return new Promise((resolve, reject) => {
      dispatch(UserActions.getUserInfoDestination({ param, resolve, reject }));
    });
  };

  const getAllExperience = (param: any): Promise<ResponseFormatItem> => {
    return new Promise((resolve, reject) => {
      dispatch(ExperienceActions.getAllExperience({ param, resolve, reject }));
    });
  };

  const getAllSkillsetForUser = (param: any): Promise<ResponseFormatItem> => {
    return new Promise((resolve, reject) => {
      dispatch(CategoryActions.getAllSkillsetForUser({ param, resolve, reject }));
    });
  };

  const getAllEducationUser = (param: any): Promise<ResponseFormatItem> => {
    return new Promise((resolve, reject) => {
      dispatch(EducationActions.getAllEducationUser({ param, resolve, reject }));
    });
  };

  const getAllQualification = (param: any): Promise<ResponseFormatItem> => {
    return new Promise((resolve, reject) => {
      dispatch(QualifycationActions.getAllQualification({ param, resolve, reject }));
    });
  };

  const getPortfolios = (param: any): Promise<ResponseFormatItem> => {
    return new Promise((resolve, reject) => {
      dispatch(PortfolioActions.getPortfolios({ param, resolve, reject }));
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

  const user: UserInterface = useSelector((state: RootState) => state.user.user)
  const notifications: Array<NotificationInterface> = useSelector((state: RootState) => state.notifications.notifications)
  const user_info: UserInterface = useSelector((state: RootState) => state.user.user_info)

  useEffect(() => {
    if (socket) {
      if (!checkLocalStorage('access_token')) {
        const nextLocation = location.pathname.replaceAll('/', '%252')
        navigate(`/signin?next=${nextLocation}`)
      } else if (location.pathname.includes('/u/')) {
        const username = location.pathname.split('/').at(-1)
        getUserInfo({}).then((res: any) => {
          if (res.code === 200) {
            if (res.data.username === username) {
              Promise.all([
                getAllExperience({ user_id: res?.data?.id }),
                getAllSkillsetForUser({ user_id: res?.data?.id }),
                getAllEducationUser({ user_id: res?.data?.id }),
                getAllQualification({ user_id: res?.data?.id }),
                getPortfolios({ user_id: res?.data?.id })
              ])
              dispatch(UserActions.getUserInforDestinationSuccess(res.data))
            } else {
              getUserInfoDestination({ username: username }).then((res) => {
                Promise.all([
                  getAllExperience({ user_id: res?.data?.id }),
                  getAllSkillsetForUser({ user_id: res?.data?.id }),
                  getAllEducationUser({ user_id: res?.data?.id }),
                  getAllQualification({ user_id: res?.data?.id }),
                  getPortfolios({ user_id: res?.data?.id })
                ])
              })
            }
          }
        })
          .catch((err) => {

            navigate('/not-found')
          })
      } else {
        getUserInfo({}).then((res) => {
          console.log(socket)
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
    if (socket) {
      socket.on("new_post_notify_response", (data: any) => {
        dispatch(UserActions.increaseNotifications({}))
        modalNotifications(
          {notiMess: data.title, description: `Here the latest project matching your skills: ${data.project_detail}\
        ,Skills: ${data.skills.map((skill: any) => {
          return skill.label
        }).join(", ")}`,noti_url:  data.noti_url
      })
      });
      socket.on("project_bidding_response", (data: any) => {
        dispatch(UserActions.increaseNotifications({}))
        return modalNotifications({notiMess: 'New bidding',description: data.message, noti_url: data.url})
      })
    }
  }, [socket])

  const handlePostProject = () => {
    navigate('/post-project')
  }

  const handleOpenNoti = () => {
    if(openNoti) {
      setOpenNoti(false)
    } else {
      getAllNotifications({}).then(() => {
        if(user.noti_count! > 0) {
          updateUser({noti_count: 0}).then(() => {
            dispatch(UserActions.updateNoticountSuccess({}))
            setOpenNoti(true)
          })
        } else {
          setOpenNoti( true)
        }
      })

    }
  }

  return (
    <div>
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
              <Popover content={<NotificationContent notifications={notifications}/>} onOpenChange={handleOpenNoti} open={openNoti} trigger="click" placement="bottom">
                <Badge count={user.noti_count} size="small">
                  <BellOutlined />
                </Badge>
              </Popover>
              <Popover content={<MessagesContent />} trigger="hover" placement="bottom">
                <Badge count={10} size="small">
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