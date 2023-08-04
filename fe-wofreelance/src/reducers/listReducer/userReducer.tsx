import { createSlice } from '@reduxjs/toolkit'
import { userReducerInterface } from '../../interface'

const initialState: userReducerInterface = {
    user: {user_active: false},
    user_skills: [],
    languages: [],
    address_generated: {},
    user_info: {user_active: false},
    isLoggedIn: false
}

const User = createSlice({
    name: 'user',
    initialState,
    reducers: ({
        signin: (state, actions) => { },
        signinSuccess: (state, actions) => {
            state.user = actions.payload;
            state.isLoggedIn = true
        },
        signout: (state, actions) => {},
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
            state.user = {...state.user, noti_count: state.user.noti_count! + 1}
        }
    })
})

export const UserActions = User.actions;

const UserReducer = User.reducer;
export default UserReducer;