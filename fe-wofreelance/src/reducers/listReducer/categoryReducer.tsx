import { createSlice } from '@reduxjs/toolkit'

const Category = createSlice({
    name: 'category',
    initialState: {
        categories: [],
        subcategories: [],
        skillsets: [],
        user_skills: []
    },
    reducers: ({
        getAllCategories: (state, actions) => {},
        getAllCategoriesSuccess: (state, actions) => {
            state.categories = actions.payload
        },

        getAllSkillsets: (state, actions) => {},
        getAllSkillsetsSuccess: (state, actions) => {
            state.skillsets = actions.payload
        },

        getAllSkillsetForNewFreelance: (state, actions) => {},
        

        getAllSkillsetForUser: (state, actions) => {},
        getAllSkillsetForUserSuccess: (state, actions) => {
            state.user_skills = actions.payload.list_skills
        },
        createDeleteSkillsetForUser: (state, actions) => {},
        createDeleteSkillsetForUserSuccess: (state, actions) => {
            state.user_skills = actions.payload.list_skills
        }
    })
})

export const CategoryActions = Category.actions;

const CategoryReducer = Category.reducer;
export default CategoryReducer;