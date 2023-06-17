import { Routes, Route, Navigate, Outlet } from "react-router-dom";

import { routerSidebar, routerNotSidebar } from "./routers"
import NotFound from './containers/NotFound';
import Dashboard from './containers/Dashboard'
import Lists from './containers/Lists';
import Layout from "./containers/Layout";
import Footer from "./containers/Footer";

const BasicLayout = () => {
  return (
    <>
    <Layout />
    <Outlet />
    <Footer />
    </>
  )
}

function App() {


  return (
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
  );
}

export default App;
