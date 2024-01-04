import { createSlice } from '@reduxjs/toolkit'
import { userReducerInterface } from '../../interface'

const initialState: userReducerInterface = {
    user: {},
    user_skills: [],
    languages: [],
    address_generated: {},
    user_info: {},
    isLoggedIn: false,
    educations: [],
}

const User = createSlice({
    name: 'user',
    initialState,
    reducers: ({
        signin: (state, actions) => { },
        signinSuccess: (state, actions) => {
            state.user = actions.payload;
            state.isLoggedIn = !state.isLoggedIn
        },
        signout: (state, actions) => {},
        signoutSuccess: (state, actions) => {
            state.isLoggedIn = false
        },
        checkExistUser: (state, actions) => { },
        registerAccount: (state, actions) => { },
        signinFacebook: (state, actions) => { },
        signinFacebookTK: (state, actions) => { },
        getUserInfo: (state, actions) => { },
        getUserInfoSuccess: (state, actions) => {
            state.user = actions.payload
        },
        getUserInfoDestination: (state, actions) => {},
        getUserInforDestinationSuccess: (state, actions) => {
            state.user_info = actions.payload
        },
        updateUser: (state, actions) => { },
        updateUserSuccess: (state, actions) => {
            state.user_info = actions.payload
        },
        getAllLanguages: (state, actions) => { },
        getAllLanguagesSuccess: (state, actions) => {
            state.languages = actions.payload
        },
        generatedAddress: (state, actions) => {},
        generatedAddressSuccess: (state, actions) => {
            state.address_generated = actions.payload
        },
        updateNoticountSuccess: (state, actions) => {
            state.user = {...state.user, noti_count: 0}
        },
        increaseNotifications: (state, actions) => {
            if(!actions.payload.noti_found || state.user.noti_count === 0) {
                state.user = {...state.user, noti_count: state.user.noti_count! + 1}
            }
        },
        getNewNotiMessSuccess: (state, actions) => {
            state.user = {...state.user, noti_mess: actions.payload}
        },
        updateNotiMessSuccess: (state, actions) => {
            state.user = {...state.user, noti_mess: 0}
        },

        //educations
        createEducation: (state, actions) => {},
        createEducationSuccess: (state, actions) => {
            state.user_info = {...state.user_info, educations: [
                ...state.user_info.educations ?? [],
                actions.payload
            ]}
        },
        deleteEducation: (state, actions) => {},
        deleteEducationSuccess: (state, actions) => {
            state.user_info = {
                ...state.user_info,
                educations: [...state.user_info.educations ?? []]?.filter((exp) => exp.id !== actions.payload.id)
            }            
        },
        updateEducation: (state, actions) => {},
        updateEducationSuccess: (state, actions:any) => {
            state.user_info = {...state.user_info, educations: [...state.user_info.educations ?? []]?.map((edu) => {
                if(edu.id === actions.payload.id) {
                    return {...actions.payload}
                } else {
                    return {...edu}
                }
            })}
        },
        getAllEducationUser: (state, actions) => {},
        getAllEducationUserSuccess: (state, actions) => {
            state.user_info = {...state.user_info, educations: actions.payload}
        },
        getAllEducation: (state, actions) => {},
        getAllEducationSuccess: (state, actions) => {
            state.educations = actions.payload.educations
        },

        //experiences
        createExperience: (state, actions) => {},
        createExperienceSuccess: (state, actions) => {
            state.user_info = {...state.user_info, experiences: [...state.user_info.experiences ?? [], actions.payload]}            
        },
        deleteExperience: (state, actions) => {},
        deleteExperienceSuccess: (state, actions) => {
            state.user_info = {...state.user_info, experiences: state.user_info.experiences?.filter((exp) => exp.id !== actions.payload.id)}
        },
        updateExperience: (state, actions) => {},
        updateExperienceSuccess: (state, actions:any) => {
            state.user_info = {...state.user_info, experiences: state.user_info.experiences?.map((exp) => {
                if(exp.id === actions.payload.id) {
                    return {...actions.payload}
                } else {
                    return {...exp}
                }
            })}
        },

        //portfolios
        createPortfolio: (state, actions) => {},
        createPortfolioSuccess: (state, actions) => {
            state.user_info = {...state.user_info, portfolios: [...state.user_info.portfolios ?? [], actions.payload]}
        },

        deletePortfolio: (state, actions) => {},
        deletePortfolioSuccess: (state, actions) => {
            state.user_info = {...state.user_info, portfolios: state.user_info.portfolios?.filter((exp) => exp.id !== actions.payload.id)}
        },

        updatePortfolio: (state, actions) => {},
        updatePortfolioSuccess: (state, actions:any) => {
            state.user_info = {...state.user_info, portfolios: state.user_info.portfolios?.map((exp) => {
                if(exp.id === actions.payload.id) {
                    return {...actions.payload}
                } else {
                    return {...exp}
                }
            })}
        },

        //qualifications
        createQualification: (state, actions) => {},
        createQualificationSuccess: (state, actions) => {
            state.user_info = {...state.user_info, qualifications: [...state.user_info.qualifications ?? [], actions.payload]}
        },
        deleteQualification: (state, actions) => {},
        deleteQualificationSuccess: (state, actions) => {
            state.user_info = {...state.user_info, qualifications: state.user_info.qualifications?.filter((exp) => exp.id !== actions.payload.id)}
        },
        updateQualification: (state, actions) => {},
        updateQualificationSuccess: (state, actions:any) => {
            state.user_info = {...state.user_info, qualifications: state.user_info.qualifications?.map((exp) => {
                if(exp.id === actions.payload.id) {
                    return {...actions.payload}
                } else {
                    return {...exp}
                }
            })}
        },
        getAllSkillsetForUser: (state, actions) => {},
        getAllSkillsetForUserSuccess: (state, actions) => {
            state.user_info = {...state.user_info, list_skills: actions.payload}
        },
        createDeleteSkillsetForUser: (state, actions) => {},
        createDeleteSkillsetForUserSuccess: (state, actions) => {
            state.user_info = {...state.user_info, list_skills: actions.payload}
        }
    })
})

export const UserActions = User.actions;

const UserReducer = User.reducer;
export default UserReducer;