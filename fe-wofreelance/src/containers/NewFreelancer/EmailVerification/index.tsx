import { useEffect, useContext } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { Link, useLocation, useNavigate } from "react-router-dom";
import { Button, Progress } from 'antd'
import axios from 'axios'

import { ResponseFormatItem, UserInterface } from '../../../interface'

import { check_email, email_verify, freelancer_logo } from '../../../assets'

import { BASE_URL } from '../../../constants';

import { RootState } from '../../../reducers/rootReducer'
import { UserActions } from '../../../reducers/listReducer/userReducer';

import { SocketContext } from '../../../SocketContext';

import './style.scss'
const EmailVerification = () => {
    const socket = useContext(SocketContext)
    const dispatch = useDispatch()
    const location = useLocation()
    const navigate = useNavigate()
    const user: UserInterface = useSelector((state: RootState) => state.user.user)
    const getUserInfo = (param: any): Promise<ResponseFormatItem> => {
        return new Promise((resolve, reject) => {
            dispatch(UserActions.getUserInfo({ param, resolve, reject }));
        });
    };

    useEffect(() => {
        getUserInfo({})
    }, [location])

    console.log('user', user)

    useEffect(() => {
        const token = localStorage.getItem('access_token')
        socket.emit('user_token', token);
        socket.on("user_info", (data) => {
            dispatch(UserActions.updateUserSuccess(data))
        });
    }, []);

    const handleFinish = () => {
        navigate('/new-freelancer/profile-detail/photo-name')
    }

    const handleMoveBackStep = () => {
        navigate('/new-freelancer/profile-detail/languages-birthday')
    }

    const handleResendEmail = () => {
        axios.get(`${BASE_URL}/user/email-verification?username=${user?.username}&first_name=${user?.first_name}`)
    }

    return (
        <div className="new-freelancer-wrapper">
            <div className="new-freelancer-container">
                <div className="new-freelancer-header">
                    <img src={freelancer_logo} alt="" />
                    <span>Skills</span>
                </div>
                <div className="new-freelancer-progress">
                    <Progress
                        percent={100}
                        strokeColor={{
                            '0%': '#108ee9',
                            '100%': '#87d068',
                        }}
                    />
                </div>
                <div className="email-verification">
                    <div className="logo">
                        <img src={!user?.is_verified_account ? check_email : email_verify} alt="" />
                    </div>
                    {!user?.is_verified_account ?
                        (<div className="non-verified">
                            <div className="note-text">
                                Almost there, Bui.
                            </div>
                            <div className="note-text warning">
                                Check your email to verify your account.
                            </div>
                            <div className="email-info">
                                lekimhoang1810@gmail.com
                            </div>
                            <div className="resend-email" onClick={() => handleResendEmail()}>
                                <span>Resend email</span>
                            </div>
                            <div className="change-email">
                                <Link to="#">Change email</Link>
                            </div>
                        </div>) : (<div className="verified">
                            <div className="note-text">
                                Thanks {user?.first_name}
                            </div>
                            <div className="note-text">
                                Your email has been verified.
                            </div>
                            <div className="note-text email">
                                {user?.email}
                            </div>
                            <div className="list-button profile-detail">
                                <Button onClick={handleMoveBackStep} className="back">Back</Button>
                                <Button onClick={handleFinish} className="next">Finish</Button>
                            </div>
                        </div>)
                    }
                </div>
            </div>
        </div>
    )
}

export default EmailVerification
