export const BASE_URL = 'http://localhost:1203/v1'
export const BACKEND_URL = 'http://localhost:1203'
export const HREF = 'http://localhost:3000/'

// content_type: image,...
// service_type: tên folder cloudinary

export const validImg = ['png', 'jpg', 'jpeg', 'bmp', 'tiff']

export const apiUrl = {
    app: {
        currency:{
            getAll: 'currency/get-all'
        },
        budgets: {
            getAll: 'budgets/get-all'
        },
        files: {
            upload: 'files/upload'
        }
    },
    user: {
        signin: 'user/login',
        signout: 'user/logout',
        checkExistUser: 'user/check',
        register: 'user/register',
        login: 'user/login',
        signinFacebook: 'user/auth/facebook',
        signinFacebookTK: 'user/login/fb',
        getUserInfo: "user/get-info",
        getUserInfoDestination: "user/destination/get-info",
        updateUser: "user/update",
        getAllLanguages: "user/language/get-all",
        generatedAddress: "user/generated/address"
    },
    categories: {
        getAll: 'job-categories/get-all',
        getAllSubcategories: 'job-categories/subcate/get-all',
        getAllSkillsets: 'job-categories/skillset/get-all',
        getAllSkillsetForNewFreelance: 'job-categories/skillset-new-freelance/get-all',
        skillset: {
            getAll: 'job-categories/skillset/user/get-all',
            createDelete: 'job-categories/skillset/user/create-delete'
        }
    },
    experience: {
        getAll: 'experience/get-all',
        create: 'experience/create',
        delete: 'experience/delete',
        update: 'experience/update'
    },
    qualification: {
        getAll: 'qualification/get-all',
        create: 'qualification/create',
        delete: 'qualification/delete',
        update: 'qualification/update'
    },
    education: {
        getAllEducation: 'education/get-all',
        getAll: 'education/user/get-all',
        create: 'education/user/create',
        delete: 'education/user/delete',
        update: 'education/user/update'
    },
    country: {
        getAll: 'country/get'
    },
    post: {
        create: 'posts/create',
        getDetail: 'posts/get-by-route',
        bidding: {
            getallBid: 'bidding/get-all',
            create: 'bidding/create',
            update: 'bidding/update',
            delete: 'bidding/delete'
        }
    },
    portfolio: {
        create: 'portfolio/create',
        getAll: 'portfolio/get-all',
        update: 'portfolio/update',
        delete: 'portfolio/delete'
    },
    notifications: {
        getAll: 'notifications/get-all',
        update: 'notifications/update'
    }
}
