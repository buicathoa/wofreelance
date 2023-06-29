/* eslint-disable array-callback-return */
import { createSlice } from '@reduxjs/toolkit'
import { experienceReducerInterface, portfolioReducerInterface } from '../../interface'

const initialState: portfolioReducerInterface = {
    portfolios: []
}

const Portfolio = createSlice({
    name: 'portfolio',
   initialState,
    reducers: ({
        getPortfolios: (state, actions) => {},
        getPortfoliosSuccess: (state, actions) => {
            state.portfolios = actions.payload
        },
        createPortfolio: (state, actions) => {},
        createPortfolioSuccess: (state, actions) => {
            state.portfolios = [...state.portfolios, actions.payload]
        },
        deletePortfolio: (state, actions) => {},
        deletePortfolioSuccess: (state, actions) => {
            state.portfolios = [...state.portfolios]?.filter((exp) => exp.id !== actions.payload.id)
        },
        updatePortfolio: (state, actions) => {},
        updatePortfolioSuccess: (state, actions:any) => {
            state.portfolios = [...state.portfolios]?.map((exp) => {
                if(exp.id === actions.payload.id) {
                    return {...actions.payload}
                } else {
                    return {...exp}
                }
            })
        }
    })
})

export const PortfolioActions = Portfolio.actions;

const PortfolioReducer = Portfolio.reducer;
export default PortfolioReducer;