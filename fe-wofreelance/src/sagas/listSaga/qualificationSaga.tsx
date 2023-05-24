
import { select , put, takeLatest } from "redux-saga/effects";
import { push } from 'react-router-redux';
import { apiRequest } from "../../utils/apiRequest";
import { HREF, apiUrl } from "../../constants";
import { AppActions } from "../../reducers/listReducer/appReducer";
import { AnyAction } from "@reduxjs/toolkit";
import { UserActions } from "../../reducers/listReducer/userReducer";
import { ResponseFormatItem } from "../../interface";
import { ExperienceActions } from "../../reducers/listReducer/experienceReducer";
import { QualifycationActions } from "../../reducers/listReducer/qualificationReducer";

export function* QualificationSaga(): Generator {
    yield takeLatest(QualifycationActions.getAllQualification({}).type, getAllQualification)
    yield takeLatest(QualifycationActions.createQualification({}).type, createQualification)
    yield takeLatest(QualifycationActions.deleteQualification({}).type, deleteQualification)
    yield takeLatest(QualifycationActions.updateQualification({}).type, updateQualification)
}

function* getAllQualification(action: AnyAction): Generator {
    const { param, resolve, reject } = action.payload
    try {
        const response = yield apiRequest(apiUrl.qualification.getAll, param, 'general')
        yield put(QualifycationActions.getAllQualificationSuccess((response as ResponseFormatItem).data))

        yield put(AppActions.openLoading(false))
        if (resolve) yield resolve(response)
    }
    catch (err) {
        yield put(AppActions.openLoading(false))
        if (reject) yield reject(err)
    }
}

function* createQualification(action: AnyAction): Generator {
    const { param, resolve, reject } = action.payload
    try {
        const response = yield apiRequest(apiUrl.qualification.create, param, 'general')
        yield put(QualifycationActions.createQualificationSuccess((response as ResponseFormatItem).data))
        yield put(AppActions.openLoading(false))
        if (resolve) yield resolve(response)
    }
    catch (err) {
        yield put(AppActions.openLoading(false))
        if (reject) yield reject(err)
    }
}

function* deleteQualification(action: AnyAction): Generator {
    const { param, resolve, reject } = action.payload
    try {
        const response = yield apiRequest(apiUrl.qualification.delete, param, 'general')
        yield put(QualifycationActions.deleteQualificationSuccess(param))
        yield put(AppActions.openLoading(false))
        if (resolve) yield resolve(response)
    }
    catch (err) {
        yield put(AppActions.openLoading(false))
        if (reject) yield reject(err)
    }
}

function* updateQualification(action: AnyAction): Generator {
    const { param, resolve, reject } = action.payload
    try {
        const response = yield apiRequest(apiUrl.qualification.update, param, 'general')
        yield put(QualifycationActions.updateQualificationSuccess(param))
        yield put(AppActions.openLoading(false))
        if (resolve) yield resolve(response)
    }
    catch (err) {
        yield put(AppActions.openLoading(false))
        if (reject) yield reject(err)
    }
}


