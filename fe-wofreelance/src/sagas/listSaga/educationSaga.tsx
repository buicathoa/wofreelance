
import { select , put, takeLatest } from "redux-saga/effects";
import { push } from 'react-router-redux';
import { apiRequest } from "../../utils/apiRequest";
import { HREF, apiUrl } from "../../constants";
import { AppActions } from "../../reducers/listReducer/appReducer";
import { AnyAction } from "@reduxjs/toolkit";
import { UserActions } from "../../reducers/listReducer/userReducer";
import { ResponseFormatItem } from "../../interface";
import { ExperienceActions } from "../../reducers/listReducer/experienceReducer";
import { EducationActions } from "../../reducers/listReducer/educationReducer";

export function* EducationSaga(): Generator {
    yield takeLatest(EducationActions.getAllEducation({}).type, getAllEducation)
    yield takeLatest(EducationActions.createEducation({}).type, createEducation)
    yield takeLatest(EducationActions.deleteEducation({}).type, deleteEducation)
    yield takeLatest(EducationActions.updateEducation({}).type, updateEducation)
    yield takeLatest(EducationActions.getAllCountries({}).type, getAllCountries)
    yield takeLatest(EducationActions.getAllEducationUser({}).type, getAllEducationUser)
}

function* getAllEducation(action: AnyAction): Generator {
    const { param, resolve, reject } = action.payload
    try {
        const response = yield apiRequest(apiUrl.education.getAllEducation, param, 'general')
        yield put(EducationActions.getAllEducationSuccess((response as ResponseFormatItem).data))

        yield put(AppActions.openLoading(false))
        if (resolve) yield resolve(response)
    }
    catch (err) {
        yield put(AppActions.openLoading(false))
        if (reject) yield reject(err)
    }
}

function* getAllEducationUser(action: AnyAction): Generator {
    const { param, resolve, reject } = action.payload
    try {
        const response = yield apiRequest(apiUrl.education.getAll, param, 'general')
        yield put(EducationActions.getAllEducationUserSuccess((response as ResponseFormatItem).data))

        yield put(AppActions.openLoading(false))
        if (resolve) yield resolve(response)
    }
    catch (err) {
        yield put(AppActions.openLoading(false))
        if (reject) yield reject(err)
    }
}

function* createEducation(action: AnyAction): Generator {
    const { param, resolve, reject } = action.payload
    try {
        const response = yield apiRequest(apiUrl.education.create, param, 'general')
        yield put(EducationActions.createEducationSuccess((response as ResponseFormatItem).data))
        yield put(AppActions.openLoading(false))
        if (resolve) yield resolve(response)
    }
    catch (err) {
        yield put(AppActions.openLoading(false))
        if (reject) yield reject(err)
    }
}

function* deleteEducation(action: AnyAction): Generator {
    const { param, resolve, reject } = action.payload
    try {
        const response = yield apiRequest(apiUrl.education.delete, param, 'general')
        yield put(EducationActions.deleteEducationSuccess(param))
        yield put(AppActions.openLoading(false))
        if (resolve) yield resolve(response)
    }
    catch (err) {
        yield put(AppActions.openLoading(false))
        if (reject) yield reject(err)
    }
}

function* updateEducation(action: AnyAction): Generator {
    const { param, resolve, reject } = action.payload
    try {
        const response = yield apiRequest(apiUrl.education.update, param, 'general')
        yield put(EducationActions.updateEducationSuccess(param))
        yield put(AppActions.openLoading(false))
        if (resolve) yield resolve(response)
    }
    catch (err) {
        yield put(AppActions.openLoading(false))
        if (reject) yield reject(err)
    }
}

function* getAllCountries(action: AnyAction): Generator {
    const { param, resolve, reject } = action.payload
    try {
        const response = yield apiRequest(apiUrl.country.getAll, param, 'general')
        yield put(EducationActions.getAllCountriesSuccess((response as ResponseFormatItem).data))
        yield put(AppActions.openLoading(false))
        if (resolve) yield resolve(response)
    }
    catch (err) {
        yield put(AppActions.openLoading(false))
        if (reject) yield reject(err)
    }
}



