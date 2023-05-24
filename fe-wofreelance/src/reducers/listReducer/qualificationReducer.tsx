/* eslint-disable array-callback-return */
import { createSlice } from '@reduxjs/toolkit'
import { experienceReducerInterface, qualificationReducerInterface } from '../../interface'

const initialState: qualificationReducerInterface = {
    qualifications: []
}

const Qualification = createSlice({
    name: 'qualification',
   initialState,
    reducers: ({
        getAllQualification: (state, actions) => {},
        getAllQualificationSuccess: (state, actions) => {
            state.qualifications = actions.payload
        },
        createQualification: (state, actions) => {},
        createQualificationSuccess: (state, actions) => {
            state.qualifications = [...state.qualifications, actions.payload]
        },
        deleteQualification: (state, actions) => {},
        deleteQualificationSuccess: (state, actions) => {
            state.qualifications = [...state.qualifications]?.filter((exp) => exp.id !== actions.payload.id)
        },
        updateQualification: (state, actions) => {},
        updateQualificationSuccess: (state, actions:any) => {
            debugger
            state.qualifications = [...state.qualifications]?.map((exp) => {
                if(exp.id === actions.payload.id) {
                    return {...actions.payload}
                } else {
                    return {...exp}
                }
            })
        }
    })
})

export const QualifycationActions = Qualification.actions;

const QualificationReducer = Qualification.reducer;
export default QualificationReducer;