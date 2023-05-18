/* eslint-disable array-callback-return */
import { createSlice } from '@reduxjs/toolkit'
import { experienceReducerInterface } from '../../interface'

const initialState: experienceReducerInterface = {
    experiences: []
}

const Experience = createSlice({
    name: 'experience',
   initialState,
    reducers: ({
        getAllExperience: (state, actions) => {},
        getAllExperienceSuccess: (state, actions) => {
            state.experiences = actions.payload.list_experiences
        },
        createExperience: (state, actions) => {},
        createExperienceSuccess: (state, actions) => {
            state.experiences = [...state.experiences, actions.payload]
        },
        deleteExperience: (state, actions) => {},
        deleteExperienceSuccess: (state, actions) => {
            state.experiences = [...state.experiences]?.filter((exp) => exp.id !== actions.payload.id)
        },
        updateExperience: (state, actions) => {},
        updateExperienceSuccess: (state, actions:any) => {
            state.experiences = [...state.experiences]?.map((exp) => {
                if(exp.id === actions.payload.exp_id) {
                    return {...actions.payload}
                } else {
                    return {...exp}
                }
            })
        }
    })
})

export const ExperienceActions = Experience.actions;

const ExperienceReducer = Experience.reducer;
export default ExperienceReducer;