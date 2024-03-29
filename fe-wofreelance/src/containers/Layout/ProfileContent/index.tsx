import React, { useContext } from 'react'
import {useSelector, useDispatch} from 'react-redux'
import { Link, useNavigate } from 'react-router-dom'
import { ResponseFormatItem, UserInterface } from 'interface'
import { RootState } from 'reducers/rootReducer'
import { UserActions } from 'reducers/listReducer/userReducer'
import { SocketContext } from 'SocketProvider'

import './style.scss'
const ProfileContent = ({user}:any) => {
    const socket: any = useContext(SocketContext)
    const dispatch = useDispatch()
    const navigate = useNavigate()
    const userItem: UserInterface = useSelector((state: RootState) => state.user.user)
    const signout = (param: any): Promise<ResponseFormatItem> => {
        return new Promise((resolve, reject) => {
            dispatch(UserActions.signout({ param, resolve, reject }));
        });
    };

    const handleSignout = () => {
        signout({}).then(() => {
            socket.emit("user_authen", {user_id: userItem.id, status: 'logout'})
            localStorage.removeItem('access_token');
                navigate('/signin')
        })
    }

    return (
        <div className="profile-content-wrapper">
            <div className="profile-content-item">
                <div className="profile-content-title">Account</div>
                <div className="profile-content-list">
                    <ul>
                        <li><Link to={`u/${user.username}`}>View profile</Link></li>
                        <li><Link to="#">Membership</Link></li>
                        <li><Link to="#">Account analytics</Link></li>
                        <li><Link to="/insights/bids">Bid Insights</Link></li>
                        <li><Link to="#">Settings</Link></li>
                    </ul>
                </div>
                <div className="profile-content-list">
                    <ul>
                        <li><Link to="#">Support</Link></li>
                        <li><Link to="#">Invite Friends</Link></li>
                        <li onClick={handleSignout}>Logout</li>
                    </ul>
                </div>
            </div>
        </div>
    )
}

export default ProfileContent