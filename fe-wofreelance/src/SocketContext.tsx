// SocketContext.js
import React, { createContext } from "react";
import { io } from "socket.io-client";

const SOCKET_URL = "http://localhost:1203";
export const socket = io(SOCKET_URL, {
    auth: {
        token: localStorage.getItem('access_token') as any,
    },
    reconnection: true,
    reconnectionDelay: 1000,
    reconnectionDelayMax: 5000,
    reconnectionAttempts: 5
});

socket.on('reconnect', () => {
    socket.emit("user_reconnect", localStorage.getItem('access_token') as any)
})

export const SocketContext = createContext(socket);