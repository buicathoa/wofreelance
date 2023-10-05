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
import { Post } from '../containers/Project/Post'
import { ProjectDetail } from '../containers/Project/ProjectDetail'
import BidInsights from '../containers/BidInsights'

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
    },
    {
        exact: true,
        element: <Post/>,
        path: '/post-project'
    },
]

export const routerSidebar = [
    {
        exact: true,
        element: <UserProfile/>,
        path: '/u/:id'
    },
    {
        exact: true,
        element: <ProjectDetail />,
        path: '/posts/:post_detail'
    },
    {
        exact: true,
        element: <BidInsights />,
        path: '/insights/bids'
    }
]