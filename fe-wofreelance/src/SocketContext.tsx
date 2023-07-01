// SocketContext.js
import React, { createContext } from "react";
import { io } from "socket.io-client";

const SOCKET_URL = "http://localhost:1203";
export const socket = io(SOCKET_URL, {
    extraHeaders: {
        Authorization: localStorage.getItem('access_token') as any,
    },
});
export const SocketContext = createContext(socket);