
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
import { LocationActions } from "../../reducers/listReducer/locationReducer";

export function* AppSaga(): Generator {
    yield takeLatest(AppActions.getCurrencies({}).type, getCurrencies)
    yield takeLatest(AppActions.getBudgets({}).type, getBudgets)
    yield takeLatest(AppActions.uploadFiles({}).type, uploadFiles)
}

function* getCurrencies(action: AnyAction): Generator {
    const { param, resolve, reject } = action.payload
    try {
        const response = yield apiRequest(apiUrl.app.currency.getAll, param, 'general')
        yield put(AppActions.getCurrenciesSuccess((response as ResponseFormatItem).data))
        yield put(AppActions.openLoading(false))
        if (resolve) yield resolve(response)
    }
    catch (err) {
        yield put(AppActions.openLoading(false))
        if (reject) yield reject(err)
    }
}

function* getBudgets(action: AnyAction): Generator {
    const { param, resolve, reject } = action.payload
    try {
        const response = yield apiRequest(apiUrl.app.budgets.getAll, param, 'general')
        yield put(AppActions.getBudgetsSuccess((response as ResponseFormatItem).data))
        yield put(AppActions.openLoading(false))
        if (resolve) yield resolve(response)
    }
    catch (err) {
        yield put(AppActions.openLoading(false))
        if (reject) yield reject(err)
    }
}

function* uploadFiles(action: AnyAction): Generator {
    const { param, resolve, reject } = action.payload
    try {
        const response = yield apiRequest(apiUrl.app.files.upload, param, 'form')
        yield put(AppActions.openLoading(false))
        if (resolve) yield resolve(response)
    }
    catch (err) {
        yield put(AppActions.openLoading(false))
        if (reject) yield reject(err)
    }
}




