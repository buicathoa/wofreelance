import { createSlice } from '@reduxjs/toolkit'

const App = createSlice({
    name: 'app',
    initialState: {
        isLoading: false 
    },
    reducers: ({
        openLoading: (state, actions) => {
            state.isLoading = actions.payload
        },
        // addToCart: (state, actions) => {}
    })
})

export const AppActions = App.actions;

const AppReducer = App.reducer;
export default AppReducer;