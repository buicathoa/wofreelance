import { createSlice } from '@reduxjs/toolkit'

const Post = createSlice({
    name: 'post',
    initialState: {
        isLoading: false,
        currencies: [],
        budgets: [] 
    },
    reducers: ({
        createPost: (state, actions) => {},
        // createPostSuccess:(state, actions) => {}
        // openLoading: (state, actions) => {
        //     state.isLoading = actions.payload
        // },
        // getCurrencies: (state, actions) => {},
        // getCurrenciesSuccess: (state, actions) => {
        //     state.currencies = actions.payload
        // },
        // getBudgets: (state, actions) => {},
        // getBudgetsSuccess: (state, actions) => {
        //     state.budgets = actions.payload
        // }
    })
})

export const PostActions = Post.actions;

const PostReducer = Post.reducer;
export default PostReducer;