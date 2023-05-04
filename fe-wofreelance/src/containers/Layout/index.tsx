import { Outlet, useNavigate, useParams } from "react-router-dom";
import { freelancer_logo } from '../../assets'
import { BellOutlined, MessageOutlined, CodeSandboxOutlined, TeamOutlined } from '@ant-design/icons'
import { Badge, Button, Popover } from "antd";
import './style.scss'
import { useEffect } from "react";
import { useDispatch } from "react-redux";
import { ResponseFormatItem, UserInterface } from "../../interface";
import { UserActions } from "../../reducers/userReducer";
import { useSelector } from "react-redux";
import { RootState } from "../../reducers/rootReducer";
import BrowseContent from "./BrowseContent";
import ManageContent from "./ManageContent";
import GroupContent from "./GroupContent";
import NotificationContent from "./NotificationContent";
import MessagesContent from "./MessagesContent";
import ProfileContent from "./ProfileContent";
import { getCookie } from "../../utils/helper";
const Layout = () => {
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const {id} = useParams()

  const getUserInfo = (param: any): Promise<ResponseFormatItem> => {
    return new Promise((resolve, reject) => {
      dispatch(UserActions.getUserInfo({ param, resolve, reject }));
    });
  };

  const user: UserInterface = useSelector((state: RootState) => state.user.user)

  useEffect(() => {
    if (localStorage.getItem('access_token')) {
      getUserInfo({username: id})
    }
  }, [])

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
                <Badge count={5}>
                  <BellOutlined />
                </Badge>
              </Popover>
              <Popover content={<MessagesContent />} trigger="hover" placement="bottom">
                <Badge count={10}>
                  <MessageOutlined />
                </Badge>
              </Popover>
            </div>
            <div className="post-profile">
              <Button>Post a Project</Button>
              <Popover content={<ProfileContent />} trigger="hover" placement="bottom">
                <div className="user-profile">
                  <img src={user?.avatar} alt="" />
                  <div className="name-balance">
                    <div className="name">@buicathoa</div>
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