import { Outlet, useLocation, useNavigate, useParams } from "react-router-dom";
import { freelancer_logo } from '../../assets'
import { BellOutlined, MessageOutlined, CodeSandboxOutlined, TeamOutlined } from '@ant-design/icons'
import { Badge, Button, Popover } from "antd";
import './style.scss'
import { useEffect } from "react";
import { useDispatch } from "react-redux";
import { ResponseFormatItem, UserInterface } from "../../interface";
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
const Layout = () => {
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const location = useLocation()
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

  const user: UserInterface = useSelector((state: RootState) => state.user.user)
  const user_info: UserInterface = useSelector((state: RootState) => state.user.user_info)

  console.log('user', user)
  useEffect(() => {
    const userTokenCookie: any = getCookie('access_token')
    if (userTokenCookie) {
      localStorage.setItem('access_token', userTokenCookie)
      getUserInfo({})
      deleteCookie('access_token')
    } else {
      if (!checkLocalStorage('access_token')) {
        const nextLocation = location.pathname.replaceAll('/', '%252')
        navigate(`/signin?next=${nextLocation}`)
      } else if (location.pathname.includes('/u/')) {
        const username = location.pathname.split('/').at(-1)
        getUserInfo({}).then((res:any) => {
          if(res.code === 200) {
            if(res.data.username === username) {
              dispatch(UserActions.getUserInforDestinationSuccess(res.data))
            }else {
              getUserInfoDestination({username: username})
            }
          }
          })
          .catch((err) => {
            navigate('/not-found')
          })
      } else {
        getUserInfo({})
      }
    }
  }, [location])


  return (
    <div>
      {/* A "layout route" is a good place to put markup you want to
            share across all the pages on your site, like navigation. */}
      <nav className="nav-bar">
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
              <Popover content={<NotificationContent />} trigger="hover" placement="bottom">
                <Badge count={5} size="small">
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
              <Button>Post a Project</Button>
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
      <Outlet />
    </div>
  );
}

export default Layout