import { Routes, Route, Outlet, Link, useLocation, useNavigate } from "react-router-dom";
import { BellOutlined, MessageOutlined, CodeSandboxOutlined, CalendarOutlined, TeamOutlined } from '@ant-design/icons'
import { Badge, Button, Popover } from "antd";
import './style.scss'
import { useEffect } from "react";
import { useDispatch } from "react-redux";
import { ResponseFormatItem, UserInterface } from "../../interface";
import { UserActions } from "../../reducers/listReducer/userReducer";
import { useSelector } from "react-redux";
import { RootState } from "../../reducers/rootReducer";
import axios from 'axios'
import LayoutBottomGeneral from "../../components/LayoutBottom/LayoutBottomGeneral";
import { BASE_URL } from "../../constants";
import { getCookie } from "../../utils/helper";

import './style.scss'
const Dashboard = () => {
  const dispatch = useDispatch()
  const location = useLocation()
  const navigate = useNavigate()

  const user: UserInterface = useSelector((state: RootState) => state.user.user)

  return (
      <div>
        <LayoutBottomGeneral />
        <div className="dashboard-container">

        </div>
      </div>
  );
}

export default Dashboard