/* eslint-disable array-callback-return */
import { createSlice } from '@reduxjs/toolkit'
import { locationReducerInterface } from '../../interface'

const initialState: locationReducerInterface = {
    countries: []
}

const Location = createSlice({
    name: 'location',
   initialState,
    reducers: ({
        getAllCountries: (state, actions) => {},
        getAllCountriesSuccess: (state, actions) => {
            state.countries = actions.payload
        },
    })
})

export const LocationActions = Location.actions;

const LocationReducer = Location.reducer;
export default LocationReducer;