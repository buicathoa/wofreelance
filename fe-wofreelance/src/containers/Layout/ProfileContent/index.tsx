import React, { useContext } from 'react'
import {useSelector} from 'react-redux'
import './style.scss'
import { Link, useNavigate } from 'react-router-dom'
import { ResponseFormatItem, UserInterface } from '../../../interface'
import { RootState } from '../../../reducers/rootReducer'
import { UserActions } from '../../../reducers/listReducer/userReducer'
import { useDispatch } from 'react-redux'
import { SocketContext } from '../../../SocketProvider'

const ProfileContent = ({user}:any) => {
    const socket: any = useContext(SocketContext)
    const dispatch = useDispatch()
    const navigate = useNavigate()
    const signout = (param: any): Promise<ResponseFormatItem> => {
        return new Promise((resolve, reject) => {
            dispatch(UserActions.signout({ param, resolve, reject }));
        });
    };

    const handleSignout = () => {
        signout({}).then(() => {
            socket.emit('user_signout', user.id)
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
                        <li><Link to="#">Bid Insights</Link></li>
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