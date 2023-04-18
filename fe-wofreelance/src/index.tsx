import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import { BrowserRouter, createBrowserRouter, Route } from 'react-router-dom';
import Layout from './containers/Layout';
import HomePage from './containers/HomePage';
import Login from './containers/Auth';
import store from './reducers/rootReducer';
import { Provider } from 'react-redux';
import Loading from './components/Loading';

const root = ReactDOM.createRoot(
  document.getElementById('root') as HTMLElement
);


root.render(
    <Provider store={store}>
      <BrowserRouter>
      <Loading />
        <App />
      </BrowserRouter>
    </Provider>
);

