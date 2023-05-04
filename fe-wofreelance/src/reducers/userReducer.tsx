import { createSlice } from '@reduxjs/toolkit'

const User = createSlice({
    name: 'user',
    initialState: {
        user: {},
        languages: [] 
    },
    reducers: ({
        signin: (state, actions) => {},
        signinSuccess: (state, actions) => {
            state.user = actions.payload
        },
        checkExistUser: (state, actions) => {},
        registerAccount:(state, actions) => {},
        signinFacebook: (state, actions) => {},
        getUserInfo: (state, actions) => {},
        getUserInfoSuccess: (state, actions) => {
            state.user = actions.payload
        },
        updateUser: (state, actions) => {},
        updateUserSuccess: (state, actions) => {
            state.user = actions.payload
        },
        getAllLanguages: (state, actions) => {},
        getAllLanguagesSuccess: (state, actions) => {
            state.languages = actions.payload
        },
    })
})

export const UserActions = User.actions;

const UserReducer = User.reducer;
export default UserReducer;