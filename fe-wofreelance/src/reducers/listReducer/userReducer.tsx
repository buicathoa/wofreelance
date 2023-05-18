import { createSlice } from '@reduxjs/toolkit'
import { userReducerInterface } from '../../interface'

const initialState: userReducerInterface = {
    user: {},
    user_skills: [],
    languages: [],
}

const User = createSlice({
    name: 'user',
    initialState,
    reducers: ({
        signin: (state, actions) => { },
        signinSuccess: (state, actions) => {
            state.user = actions.payload
        },
        checkExistUser: (state, actions) => { },
        registerAccount: (state, actions) => { },
        signinFacebook: (state, actions) => { },
        signinFacebookTK: (state, actions) => { },
        getUserInfo: (state, actions) => { },
        getUserInfoSuccess: (state, actions) => {
            state.user = actions.payload
        },
        updateUser: (state, actions) => { },
        updateUserSuccess: (state, actions) => {
            state.user = actions.payload
        },
        getAllLanguages: (state, actions) => { },
        getAllLanguagesSuccess: (state, actions) => {
            state.languages = actions.payload
        },

    })
})

export const UserActions = User.actions;

const UserReducer = User.reducer;
export default UserReducer;