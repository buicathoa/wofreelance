import React, { useEffect, useState } from 'react'
import { link_accounts, facebook_icon, linkedin_icon } from '../../../assets'
import { PlusOutlined, CheckOutlined } from '@ant-design/icons'
import { useSelector, useDispatch } from 'react-redux';
import { freelancer_logo, facebook_icon_white } from '../../../assets'

import './style.scss'
import { RootState } from '../../../reducers/rootReducer'
import { LinkAccountsComponentInterface, ResponseFormatItem, UserInterface } from '../../../interface';
import { useLocation, useNavigate } from 'react-router-dom';
import { Button, Progress } from 'antd';
import { UserActions } from '../../../reducers/userReducer';

const LinkAccounts = () => {
    const location = useLocation()
    const navigate = useNavigate()
    const dispatch = useDispatch()

    const getUserInfo = (param: any): Promise<ResponseFormatItem> => {
        return new Promise((resolve, reject) => {
            dispatch(UserActions.getUserInfo({ param, resolve, reject }));
        });
    };

    useEffect(() => {
        if (localStorage.getItem('access_token')) {
            getUserInfo({}).then(res => {
                if (res.data) {
                    return
                } else {
                    navigate("/signin")
                }
            })
        } else {
            navigate("/signin")
        }
    }, [])

    const user: UserInterface = useSelector((state: RootState) => state.user.user)
    console.log(
        'userne', user
    )
    const handleLinkWithFacebook = (type: string) => {
        window.open(`http://localhost:1203/v1/user/auth/facebook/callback?user_id=${user.id}`, '_self')
    }

    const handleMoveBackStep = () => {
        navigate('/new-freelancer/skills')
    }

    const handleMoveNextStep = () => {
        navigate('/new-freelancer/profile-detail')
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
                        percent={40}
                        strokeColor={{
                            '0%': '#108ee9',
                            '100%': '#87d068',
                        }}
                    />
                </div>
                <div className="new-freelancer-content">
                    <div className="link-account-container">
                        <img src={link_accounts} alt="" />
                        <div className="link-account-title">
                            Link your accounts
                        </div>
                        <div className="link-account-description">
                            Save time filling out your profile and build trust by linking your accounts.
                        </div>
                        <div className="link-account-list">
                            <div className="link-account-item" onClick={() => handleLinkWithFacebook('facebook')}>
                                <div className="link-account-item-left">
                                    <img src={facebook_icon} alt="" />
                                    <div className="link-account-item-content">
                                        <div className="title">Facebook</div>
                                        <div className="description">
                                            Import your photo, name, and email address
                                        </div>
                                    </div>
                                </div>
                                {user.facebook ? <CheckOutlined className="check-icon" /> : <PlusOutlined />}
                            </div>
                            <div className="link-account-item">
                                <div className="link-account-item-left">
                                    <img src={linkedin_icon} alt="" />
                                    <div className="link-account-item-content">
                                        <div className="title">Linkedln</div>
                                        <div className="description">
                                            Import your photo, name, and email address
                                        </div>
                                    </div>
                                </div>
                                <PlusOutlined />
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <div className={`list-button link-accounts`}>
                <Button onClick={handleMoveBackStep} className="back">Back</Button>
                <Button onClick={handleMoveNextStep} className="next">Next</Button>
            </div>
        </div>
    )
}

export default LinkAccounts
