import React, { useState } from 'react';
import { Routes, Route, Outlet, Link, RouterProvider, createBrowserRouter } from "react-router-dom";
import  {routerAuth, routerNotAuth} from "./routers"
import HomePage from './containers/HomePage'
import Login from './containers/Auth'
import Layout from './containers/Layout'
import Auth from './containers/Auth';

function App() {
  return (
    <Routes>
        <Route path="/" element={<Layout />}>
          {routerAuth.map(((route: any, index) => {
            return <Route index={index === 0 ? true : false} key={index} element={route.element} path={route.path}/>
          }))}
        </Route>
        {routerNotAuth.map((route:any, index) => {
          return <Route path={route.path} key={index} element={route.element} />
        })}
      </Routes>
  );
}

export default App;
