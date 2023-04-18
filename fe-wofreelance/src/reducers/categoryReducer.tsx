import { createSlice } from '@reduxjs/toolkit'

const Category = createSlice({
    name: 'category',
    initialState: {
        categories: [],
        subcategories: [],
        skillsets: []
    },
    reducers: ({
        getAllCategories: (state, actions) => {},
        getAllCategoriesSuccess: (state, actions) => {
            state.categories = actions.payload
        },
        getAllSubcategories: (state, actions) => {},
        getAllSubcategoriesSuccess: (state, actions) => {
            state.subcategories = actions.payload
        },

        getAllSkillsets: (state, actions) => {},
        getAllSkillsetsSuccess: (state, actions) => {
            state.skillsets = actions.payload
        },

        getAllSkillsetForNewFreelance: (state, actions) => {}
        // addToCart: (state, actions) => {}
    })
})

export const CategoryActions = Category.actions;

const CategoryReducer = Category.reducer;
export default CategoryReducer;