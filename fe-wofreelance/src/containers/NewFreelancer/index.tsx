/* eslint-disable no-fallthrough */
import { Button, Progress } from 'antd'
import { freelancer_logo, facebook_icon_white } from '../../assets'
import './style.scss'
import { useLocation, Link, useNavigate } from 'react-router-dom'

import React, { useEffect, useState } from 'react'
import { useSelector, useDispatch } from 'react-redux';
import SkillSelected from './SkillSelected'
import { ResponseFormatItem, SkillsetInterface } from '../../interface'
import { UserActions } from '../../reducers/userReducer'
import { useAppDispatch, useAppSelector } from '../../reducers/hook'
import { RootState } from '../../reducers/rootReducer';
import LinkAccounts from './LinkAccounts'
import ProfileDetail from './ProfileDetail'

const NewFreelancer = () => {

    const location = useLocation()
    const navigate = useNavigate()
    const dispatch = useDispatch()

    const [step, setStep] = useState(1)
    const [percent, setPercent] = useState(0)
    const [pathname, setPathname] = useState('')
    const [skillsetSelected, setSkillsetSelected] = useState<Array<SkillsetInterface>>([])

    const getUserInfo = (param: any): Promise<ResponseFormatItem> => {
        return new Promise((resolve, reject) => {
            dispatch(UserActions.getUserInfo({ param, resolve, reject }));
        });
    };

    const updateUser = (param: any): Promise<ResponseFormatItem> => {
        return new Promise((resolve, reject) => {
            dispatch(UserActions.updateUser({ param, resolve, reject }));
        });
    };

    useEffect(() => {
        const endpoint: any = location.pathname.split('/').at(-1)
        setPathname(endpoint)
        if(endpoint === 'new-freelancer' || endpoint === 'new-freelancer/'){
            navigate('/new-freelancer/skills')
        } else {
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
        }
    }, [location])


    const handleMoveNextStep = () => {
        switch (percent) {
            case 20:
                updateUser({list_skills: skillsetSelected}).then(res => {
                    if(res.code === 200) {
                        navigate('/new-freelancer/link-accounts')
                    }
                })
                break;
            case 40:
                navigate('/new-freelancer/profile-detail')
                break
        }
    }

    const handleMoveBackStep = () => {
        switch (percent) {
            case 40:
                navigate('/new-freelancer/skills')
        }
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
                        percent={percent}
                        strokeColor={{
                            '0%': '#108ee9',
                            '100%': '#87d068',
                        }}
                    />
                </div>
                {pathname === 'skills' && <SkillSelected setPercent={setPercent} skillsetSelected={skillsetSelected} setSkillsetSelected={setSkillsetSelected}/>}
                {(pathname === 'linked-accounts' || pathname === 'link-accounts') && <LinkAccounts setPercent={setPercent} />}
                {pathname === 'profile-detail' && <ProfileDetail setPercent={setPercent}/>}
            </div>
            <div className={`list-button ${pathname}`}>
                {percent !== 20 && <Button onClick={handleMoveBackStep} className="back">Back</Button>}
                <Button onClick={handleMoveNextStep} className="next">Next</Button>
            </div>
        </div>
    )
}

export default NewFreelancer
