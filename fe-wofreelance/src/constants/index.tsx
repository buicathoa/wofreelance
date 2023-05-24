export const BASE_URL = 'http://localhost:1203/v1'
export const BACKEND_URL = 'http://localhost:1203'
export const HREF = 'http://localhost:3000/'
export const apiUrl = {
    user: {
        signin: 'user/login',
        checkExistUser: 'user/check',
        register: 'user/register',
        login: 'user/login',
        signinFacebook: 'user/auth/facebook',
        signinFacebookTK: 'user/login/fb',
        getUserInfo: "user/get-info",
        updateUser: "user/update",
        getAllLanguages: "user/language/get-all"
    },
    categories: {
        getAll: 'job-categories/get-all',
        getAllSubcategories: 'job-categories/subcate/get-all',
        getAllSkillsets: 'job-categories/skillset-user/get-all',
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
    }
}
