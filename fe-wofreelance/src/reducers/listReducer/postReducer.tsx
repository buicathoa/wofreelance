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
        getPost: (state, actions) => {}
    })
})

export const PostActions = Post.actions;

const PostReducer = Post.reducer;
export default PostReducer;