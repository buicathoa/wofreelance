// SocketContext.js
import React, {createContext} from "react";
import { io } from "socket.io-client";

const SOCKET_URL = "http://localhost:1203";
export const socket = io(SOCKET_URL);
export const SocketContext = createContext(socket);