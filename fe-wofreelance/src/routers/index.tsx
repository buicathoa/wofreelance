import Auth from '../containers/Auth'
import Signup from '../containers/Auth/Signup'
import HomePage from '../containers/HomePage'
import NewFreelancer from '../containers/NewFreelancer'


export const routerNotSidebar = [
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
        element: <NewFreelancer/>,
        path: '/new-freelancer/:id'
    },
    {
        element: <NewFreelancer/>,
        path: '/new-freelancer'
    }
]

export const routerSidebar = [
    {
        exact: true,
        element: <HomePage/>,
        path: '/'
    },
]