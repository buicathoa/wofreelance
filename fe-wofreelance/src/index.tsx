import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import { Provider } from 'react-redux';

import Loading from './components/Loading';
import App from './App';
import Layout from './containers/Layout';
import store from './reducers/rootReducer';
import { SocketContext, socket } from "./SocketContext";

import './index.css';
const root = ReactDOM.createRoot(
  document.getElementById('root') as HTMLElement
);


root.render(
  <SocketContext.Provider value={socket}>
    <Provider store={store}>
      <BrowserRouter>
        <Loading />
        <App />
      </BrowserRouter>
    </Provider>
  </SocketContext.Provider>
);

