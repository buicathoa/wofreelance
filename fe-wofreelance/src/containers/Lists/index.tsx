import { Routes, Route, Outlet, Link, useNavigate, useLocation, useParams } from "react-router-dom";
import { freelancer_logo } from '../../assets'
import { BellOutlined, MessageOutlined, CodeSandboxOutlined, CalendarOutlined, TeamOutlined } from '@ant-design/icons'
import { Badge, Button, Popover } from "antd";
import './style.scss'
import { useEffect } from "react";
import { useDispatch } from "react-redux";
import { ResponseFormatItem, UserInterface } from "../../interface";
import { UserActions } from "../../reducers/userReducer";
import { useSelector } from "react-redux";
import { RootState } from "../../reducers/rootReducer";
import LayoutBottomGeneral from "../../components/LayoutBottom/LayoutBottomGeneral";
const Lists = () => {
    const dispatch = useDispatch()
    const location = useLocation()
    const navigate = useNavigate()
    const listValidRoute = ['favorites', 'my-hires', 'recently-viewed-users', 'lists']
    // useEffect(() => {
    //     const endpoint = location.pathname.split('/').at(-1)
    //     if (endpoint && listValidRoute.includes(endpoint)) {
    //         if (endpoint === 'lists') {
    //             navigate('/lists/favorites')
    //         } else {
    //             navigate(location.pathname)
    //         }
    //     } else {
    //         navigate('/not-found')
    //     }
    // }, [location])

    const getUserInfo = (param: any): Promise<ResponseFormatItem> => {
        return new Promise((resolve, reject) => {
            dispatch(UserActions.getUserInfo({ param, resolve, reject }));
        });
    };

    const user: UserInterface = useSelector((state: RootState) => state.user.user)

    useEffect(() => {
        if (localStorage.getItem('access_token')) {
            getUserInfo({})
        }
    }, [])

    return (
        <div>
            <LayoutBottomGeneral />
            Lists  ne
        </div>
    );
}

export default Lists