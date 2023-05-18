import { Routes, Route, Outlet, Link, useLocation } from "react-router-dom";
import { freelancer_logo } from '../../../assets'
import { BellOutlined, MessageOutlined, CodeSandboxOutlined, CalendarOutlined, TeamOutlined } from '@ant-design/icons'
import { Badge, Button, Popover } from "antd";
import './style.scss'
import { useEffect } from "react";
import { useDispatch } from "react-redux";
import { ResponseFormatItem, UserInterface } from "../../../interface";
import { UserActions } from "../../../reducers/listReducer/userReducer";
import { useSelector } from "react-redux";
import { RootState } from "../../../reducers/rootReducer";
import { NavLink } from "react-router-dom";
const LayoutBottomProfile = () => {
  const dispatch = useDispatch()
  const location = useLocation()

  useEffect(() => {

  }, [location])

  return (
    <div>
      {/* A "layout route" is a good place to put markup you want to
            share across all the pages on your site, like navigation. */}
      <nav className="nav-bar">
        <div className="nav-bar-bottom-wrapper">
          <div className="nav-bar-bottom-container">
            <NavLink to="/dashboard"><div className="nav-bar-bottom-item">MY PROFILE</div></NavLink>
            <NavLink to={"/lists/favorites"}><div className="nav-bar-bottom-item">Improve Profile</div></NavLink>
            <NavLink to={"/lists/favorites"}><div className="nav-bar-bottom-item">Get Certified</div></NavLink>
            <NavLink to={"/lists/favorites"}><div className="nav-bar-bottom-item">Promote Profile</div></NavLink>
            <NavLink to={"/lists/favorites"}><div className="nav-bar-bottom-item">My Rewards</div></NavLink>
          </div>
        </div>
      </nav>
    </div>
  );
}

export default LayoutBottomProfile