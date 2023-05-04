import { Routes, Route, Outlet, Link, useLocation, useNavigate } from "react-router-dom";
import { BellOutlined, MessageOutlined, CodeSandboxOutlined, CalendarOutlined, TeamOutlined } from '@ant-design/icons'
import { Badge, Button, Popover } from "antd";
import './style.scss'
import { useEffect } from "react";
import { useDispatch } from "react-redux";
import { ResponseFormatItem, UserInterface } from "../../interface";
import { UserActions } from "../../reducers/userReducer";
import { useSelector } from "react-redux";
import { RootState } from "../../reducers/rootReducer";
import LayoutBottomGeneral from "../../components/LayoutBottomGeneral";
const Layout = () => {
  const dispatch = useDispatch()
  const location = useLocation()
  const navigate = useNavigate()
  
  // useEffect(() => {
  //   if(location.pathname === '/'){
  //     navigate('/dashboard')
  //   }  
  // }, [location])

  const getUserInfo = (param: any): Promise<ResponseFormatItem> => {
    return new Promise((resolve, reject) => {
      dispatch(UserActions.getUserInfo({ param, resolve, reject }));
    });
  };

  const user: UserInterface = useSelector((state: RootState) => state.user.user)

  useEffect(() => {
    if (localStorage.getItem('access_token')) {
      getUserInfo({})
    }
  }, [])

  return (
      <div>
        <LayoutBottomGeneral />
        
      </div>
  );
}

export default Layout