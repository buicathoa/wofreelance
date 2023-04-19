import Auth from '../containers/Auth'
import Signup from '../containers/Auth/Signup'
import HomePage from '../containers/HomePage'
import LinkAccounts from '../containers/NewFreelancer/LinkAccounts'
import ProfileDetail from '../containers/NewFreelancer/ProfileDetail'
import SkillSelected from '../containers/NewFreelancer/SkillSelected'


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
        element: <SkillSelected/>,
        path: '/new-freelancer/skills'
    },
    {
        element: <LinkAccounts/>,
        path: '/new-freelancer/link-accounts'
    },
    // {
    //     element: <ProfileDetail/>,
    //     path: '/new-freelancer/profile-detail'
    // },
]

export const routerSidebar = [
    {
        exact: true,
        element: <HomePage/>,
        path: '/'
    },
]