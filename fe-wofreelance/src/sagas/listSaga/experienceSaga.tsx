
import { select , put, takeLatest } from "redux-saga/effects";
import { push } from 'react-router-redux';
import { apiRequest } from "../../utils/apiRequest";
import { HREF, apiUrl } from "../../constants";
import { AppActions } from "../../reducers/listReducer/appReducer";
import { AnyAction } from "@reduxjs/toolkit";
import { UserActions } from "../../reducers/listReducer/userReducer";
import { ResponseFormatItem } from "../../interface";
import { ExperienceActions } from "../../reducers/listReducer/experienceReducer";

export function* ExperienceSaga(): Generator {
    yield takeLatest(ExperienceActions.getAllExperience({}).type, getAllExperience)
    yield takeLatest(ExperienceActions.createExperience({}).type, createExperience)
    yield takeLatest(ExperienceActions.deleteExperience({}).type, deleteExperience)
    yield takeLatest(ExperienceActions.updateExperience({}).type, updateExperience)
}

function* getAllExperience(action: AnyAction): Generator {
    const { param, resolve, reject } = action.payload
    try {
        const response = yield apiRequest(apiUrl.experience.getAll, param, 'general')
        yield put(ExperienceActions.getAllExperienceSuccess((response as ResponseFormatItem).data))

        yield put(AppActions.openLoading(false))
        if (resolve) yield resolve(response)
    }
    catch (err) {
        yield put(AppActions.openLoading(false))
        if (reject) yield reject(err)
    }
}

function* createExperience(action: AnyAction): Generator {
    const { param, resolve, reject } = action.payload
    try {
        const response = yield apiRequest(apiUrl.experience.create, param, 'general')
        yield put(ExperienceActions.createExperienceSuccess((response as ResponseFormatItem).data))
        yield put(AppActions.openLoading(false))
        if (resolve) yield resolve(response)
    }
    catch (err) {
        yield put(AppActions.openLoading(false))
        if (reject) yield reject(err)
    }
}

function* deleteExperience(action: AnyAction): Generator {
    const { param, resolve, reject } = action.payload
    try {
        const response = yield apiRequest(apiUrl.experience.delete, param, 'general')
        yield put(ExperienceActions.deleteExperienceSuccess(param))
        yield put(AppActions.openLoading(false))
        if (resolve) yield resolve(response)
    }
    catch (err) {
        yield put(AppActions.openLoading(false))
        if (reject) yield reject(err)
    }
}

function* updateExperience(action: AnyAction): Generator {
    const { param, resolve, reject } = action.payload
    try {
        const response = yield apiRequest(apiUrl.experience.update, param, 'general')
        yield put(ExperienceActions.updateExperienceSuccess(param))
        yield put(AppActions.openLoading(false))
        if (resolve) yield resolve(response)
    }
    catch (err) {
        yield put(AppActions.openLoading(false))
        if (reject) yield reject(err)
    }
}


