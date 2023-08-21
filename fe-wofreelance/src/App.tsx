import { Routes, Route, Navigate, Outlet, useNavigate, useLocation } from "react-router-dom";

import { routerSidebar, routerNotSidebar } from "./routers"
import NotFound from './containers/NotFound';
import Dashboard from './containers/Dashboard'
import Lists from './containers/Lists';
import Layout from "./containers/Layout";
import Footer from "./containers/Footer";

import { useContext, useEffect, useState } from "react";
import { io } from "socket.io-client";
import { UserInterface } from "./interface";
import { useSelector } from "react-redux";
import { RootState } from "./reducers/rootReducer";
import { checkLocalStorage } from "./utils/helper";
import { BellFilled, UpOutlined, FilterOutlined, SearchOutlined } from '@ant-design/icons'
import { Input } from "antd";
import ChatWindowFrame from "./containers/ChatWindowFrame";
// import { socket } from "./SocketContext";

const BasicLayout = () => {
  const navigate = useNavigate()
  const location = useLocation()
  const isLoggedIn: boolean = useSelector((state: RootState) => state.user.isLoggedIn)
  useEffect(() => {
    const checkLocalStorages = checkLocalStorage('access_token')
    if (!checkLocalStorages) {
      const nextLocation = location.pathname.replaceAll('/', '%252')
      navigate(`/signin?next=${nextLocation}`)
    }
  }, [isLoggedIn])

  return (
    <>
      <Layout />
      <Outlet />
      <Footer />
    </>
  )
}

function App() {

  const [viewMessage, setViewMessage] = useState(true)

  const handleOpenListMessage = () => {
    setViewMessage(!viewMessage)
  }

  return (
    <>
      <Routes>
        <Route path="/" element={<BasicLayout />}>
          <Route path="/" element={<Navigate to="/dashboard" replace />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/lists" element={<Navigate to="/lists/favorites" replace />} />
          <Route path="/lists/:id" element={<Lists />} />
          {routerSidebar.map(((route: any, index) => {
            return <Route index={index === 0 ? true : false} key={index} element={route.element} path={route.path} />
          }))}
        </Route>

        {routerNotSidebar.map((route: any, index) => {
          return <Route path={route.path} key={index} element={route.element} />
        })}
        <Route path="/not-found" element={<NotFound />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </>
  );
}

export default App;
