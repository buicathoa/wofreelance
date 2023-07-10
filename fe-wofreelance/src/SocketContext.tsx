// import React, { createContext } from "react";
// import { io } from "socket.io-client";

// const SOCKET_URL = "http://localhost:1203";

// console.log('oken3', localStorage.getItem('access_token'))

// export const socket = io(SOCKET_URL, {
//     query: {
//         token: localStorage.getItem('access_token'),
//     },
//     autoConnect: false,
//     reconnection: true,
//     reconnectionDelay: 1000,
//     reconnectionDelayMax: 5000,
//     reconnectionAttempts: 5
// });

// socket.on('reconnect', () => {
//     socket.emit("user_reconnect", localStorage.getItem('access_token') as any)
// })

// socket.on('disconnect', () => {
//     console.log('disconnect')
// })

// export const SocketContext = createContext(socket);