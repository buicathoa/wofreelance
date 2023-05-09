import { Routes, Route, Outlet, Link, useLocation } from "react-router-dom";
import { freelancer_logo } from '../../../assets'
import { BellOutlined, MessageOutlined, CodeSandboxOutlined, CalendarOutlined, TeamOutlined } from '@ant-design/icons'
import { Badge, Button, Popover } from "antd";
import './style.scss'
import { useEffect } from "react";
import { useDispatch } from "react-redux";
import { ResponseFormatItem, UserInterface } from "../../../interface";
import { UserActions } from "../../../reducers/userReducer";
import { useSelector } from "react-redux";
import { RootState } from "../../../reducers/rootReducer";
import { NavLink } from "react-router-dom";
const LayoutBottomGeneral = () => {
  const dispatch = useDispatch()
  const location = useLocation()

  const getUserInfo = (param: any): Promise<ResponseFormatItem> => {
    return new Promise((resolve, reject) => {
      dispatch(UserActions.getUserInfo({ param, resolve, reject }));
    });
  };

  const user: UserInterface = useSelector((state: RootState) => state.user.user)

  // useEffect(() => {
  //   if (localStorage.getItem('access_token')) {
  //     getUserInfo({})
  //   }
  // }, [])

  useEffect(() => {

  }, [location])

  return (
    <div>
      {/* A "layout route" is a good place to put markup you want to
            share across all the pages on your site, like navigation. */}
      <nav className="nav-bar">
        <div className="nav-bar-bottom-wrapper">
          <div className="nav-bar-bottom-container">
            <NavLink to="/dashboard"><div className="nav-bar-bottom-item">Dashboard</div></NavLink>
            <NavLink to={"/lists/favorites"}><div className="nav-bar-bottom-item">Lists</div></NavLink>
            <NavLink to={"/lists/favorites"}><div className="nav-bar-bottom-item">Tasklists</div></NavLink>
            <NavLink to={"/lists/favorites"}><div className="nav-bar-bottom-item">My projects</div></NavLink>
            <NavLink to={"/lists/favorites"}><div className="nav-bar-bottom-item">Inbox</div></NavLink>
            <NavLink to={"/lists/favorites"}><div className="nav-bar-bottom-item">Feedback</div></NavLink>
            <NavLink to={"/lists/favorites"}><div className="nav-bar-bottom-item">Free Credit</div></NavLink>
          </div>
        </div>
      </nav>
    </div>
  );
}

export default LayoutBottomGeneral