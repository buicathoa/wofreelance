import Auth from '../containers/Auth'
import Signup from '../containers/Auth/Signup'
import HomePage from '../containers/HomePage'


export const routerNotAuth = [
    {
        element: <Auth/>,
        path: '/signin'
    },
    {
        element: <Signup/>,
        path: '/signup'
    },
    {
        element: <Auth/>,
        path: '/forgot-password'
    },
    {
        element: <Auth/>,
        path: '/change-password'
    }
]

export const routerAuth = [
    {
        exact: true,
        element: <HomePage/>,
        path: '/'
    },
]