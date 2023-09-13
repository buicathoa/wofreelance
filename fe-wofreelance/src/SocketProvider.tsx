import React from 'react'
import { createContext, useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import io from 'socket.io-client';
import { RootState } from './reducers/rootReducer';

const SocketContext = createContext(null);

const SocketProvider = ({ children }: any) => {
    const isLoggedIn: boolean = useSelector((state: RootState) => state.user.isLoggedIn)
    const [socket, setSocket] = useState<any>()
    useEffect(() => {
        if (localStorage.getItem('access_token')) {
            const SOCKET_URL = "http://localhost:1203";
            const sockets = io(SOCKET_URL, {
                auth: {
                    token: localStorage.getItem('access_token'),
                },
                autoConnect: true,
                reconnection: true,
                reconnectionDelay: 1000,
                reconnectionDelayMax: 5000,
                reconnectionAttempts: 5
            })
            sockets.on('connect', () => {
                setSocket(sockets)
                localStorage.setItem('socketId', sockets.id)
            })            
        } 
        // else {
        //     const nextLocation = location.pathname.replaceAll('/', '%252')
        //     navigate(`/signin`)
        // }
        
    }, [isLoggedIn])


    return (
        <SocketContext.Provider value={socket}>{children}</SocketContext.Provider>
    );
};

export { SocketProvider, SocketContext };

