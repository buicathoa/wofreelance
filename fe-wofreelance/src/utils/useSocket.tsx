import { useState, useEffect, useContext } from 'react';
// import { SocketContext } from '../SocketContext';


// const useSocketData = (event: string) => {
//   const [data, setData] = useState(null);
//   const socket = useContext(SocketContext)
//   useEffect(() => {
//     socket.on('event_name', (message) => {
//       setData(message);
//     });
//     return () => {
//       socket.off('event_name');
//     };
//   }, []);

//   return data;
// };

// export default useSocketData