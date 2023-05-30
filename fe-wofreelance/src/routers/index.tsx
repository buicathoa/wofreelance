import Auth from '../containers/Auth'
import Signup from '../containers/Auth/Signup'
import EmailVerification from '../containers/NewFreelancer/EmailVerification'
import LinkAccounts from '../containers/NewFreelancer/LinkAccounts'
import ProfileDetail from '../containers/NewFreelancer/ProfileDetail'
import SkillSelected from '../containers/NewFreelancer/SkillSelected'
import Located from '../containers/NewFreelancer/ProfileDetail/Located'
import Dashboard from '../containers/Dashboard'
import Lists from '../containers/Lists'
import UserProfile from '../containers/User'

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
    {
        element: <ProfileDetail/>,
        path: '/new-freelancer/profile-detail/:id'
    },
    {
        element: <EmailVerification/>,
        path: '/new-freelancer/email-verification'
    }
]

export const routerSidebar = [
    {
        exact: true,
        element: <UserProfile/>,
        path: '/u/:id'
    },
]