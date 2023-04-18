import React, { useEffect, useState } from 'react'
import { link_accounts, facebook_icon, linkedin_icon } from '../../../assets'
import { PlusOutlined, CheckOutlined } from '@ant-design/icons'
import { useSelector, useDispatch } from 'react-redux';

import './style.scss'
import { RootState } from '../../../reducers/rootReducer'
import { LinkAccountsComponentInterface, UserInterface } from '../../../interface';
import { useLocation } from 'react-router-dom';

const LinkAccounts = ({setPercent}: LinkAccountsComponentInterface) => {
    const location = useLocation()
    useEffect(() => {
        const endpoint = location.pathname.split('/').at(-1)
        if(endpoint === 'link-accounts' || endpoint === 'linked-accounts') {
            setPercent(40)
        }
    }, [location])

    const user: UserInterface = useSelector((state: RootState) => state.user.user)
    console.log(
        'userne', user
    )
    const handleLinkWithFacebook = (type: string) => {
        window.open(`http://localhost:1203/v1/user/auth/facebook/callback?user_id=${user.id}`, '_self')
    }
    
    return (
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
    )
}

export default LinkAccounts
