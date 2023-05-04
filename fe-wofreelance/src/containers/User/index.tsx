import React, { useEffect } from 'react'
import './style.scss'
import { useDispatch, useSelector } from 'react-redux';
import { ResponseFormatItem, UserInterface } from '../../interface';
import { UserActions } from '../../reducers/userReducer';
import { RootState } from '../../reducers/rootReducer';
import { useLocation, useNavigate, useParams } from 'react-router-dom';

const UserProfile = () => {
    const dispatch = useDispatch()
    const navigate = useNavigate()

    return (
        <div>UserProfile</div>
    )
}

export default UserProfile