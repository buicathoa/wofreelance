/* eslint-disable array-callback-return */
import { createSlice } from '@reduxjs/toolkit'
import { educationReducerInterface } from '../../interface'

const initialState: educationReducerInterface = {
    educations: [],
    user_educations: [],
    countries: []
}

const Education = createSlice({
    name: 'experience',
   initialState,
    reducers: ({
        getAllEducation: (state, actions) => {},
        getAllEducationSuccess: (state, actions) => {
            state.educations = actions.payload.universities
        },
        getAllEducationUser: (state, actions) => {},
        getAllEducationUserSuccess: (state, actions) => {
            state.user_educations = actions.payload
        },
        getAllCountries: (state, actions) => {},
        getAllCountriesSuccess: (state, actions) => {
            state.countries = actions.payload
        },
        createEducation: (state, actions) => {},
        createEducationSuccess: (state, actions) => {
            state.educations = [...state.educations, actions.payload]
        },
        deleteEducation: (state, actions) => {},
        deleteEducationSuccess: (state, actions) => {
            state.educations = [...state.educations]?.filter((exp) => exp.id !== actions.payload.id)
        },
        updateEducation: (state, actions) => {},
        updateEducationSuccess: (state, actions:any) => {
            state.educations = [...state.educations]?.map((exp) => {
                if(exp.id === actions.payload.exp_id) {
                    return {...actions.payload}
                } else {
                    return {...exp}
                }
            })
        }
    })
})

export const EducationActions = Education.actions;

const EducationReducer = Education.reducer;
export default EducationReducer;