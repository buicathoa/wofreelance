import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import { Provider } from 'react-redux';

import Loading from './components/Loading';
import App from './App';
import Layout from './containers/Layout';
import store from './reducers/rootReducer';
// import { SocketContext, socket } from "./SocketContext";

import './index.css';
// import { socket, SocketContext } from './SocketContext';
import { SocketProvider } from './SocketProvider';
// import { SocketProvider } from './SocketProvider';
const root = ReactDOM.createRoot(
  document.getElementById('root') as HTMLElement
);


root.render(
  <Provider store={store}>
    <SocketProvider>
      <BrowserRouter>
        <Loading />
        <App />
      </BrowserRouter>
    </SocketProvider>
  </Provider>
);

