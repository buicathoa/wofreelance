import { createSlice } from '@reduxjs/toolkit'

const App = createSlice({
    name: 'app',
    initialState: {
        isLoading: false,
        currencies: [],
        budgets: [] 
    },
    reducers: ({
        openLoading: (state, actions) => {
            state.isLoading = actions.payload
        },
        getCurrencies: (state, actions) => {},
        getCurrenciesSuccess: (state, actions) => {
            state.currencies = actions.payload
        },
        getBudgets: (state, actions) => {},
        getBudgetsSuccess: (state, actions) => {
            state.budgets = actions.payload
        },
        uploadFiles: (state, acctions) => {}
        // addToCart: (state, actions) => {}
    })
})

export const AppActions = App.actions;

const AppReducer = App.reducer;
export default AppReducer;