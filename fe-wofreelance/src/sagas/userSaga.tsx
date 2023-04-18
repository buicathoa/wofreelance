
import { call, put, takeLatest } from "redux-saga/effects";
import { push } from 'react-router-redux';
import { apiRequest } from "../utils/apiRequest";
import { apiUrl } from "../constants";
import { AppActions } from "../reducers/appReducer";
import { AnyAction } from "@reduxjs/toolkit";
import { UserActions } from "../reducers/userReducer";
import { ResponseFormatItem } from "../interface";

export function* UserTaskSaga():Generator {
    // yield takeLatest(GeneralMenuActions.fetchAllGeneralMenu().type, fetchAllGeneralMenus)
    yield takeLatest(UserActions.signin({}).type, signIn)
    yield takeLatest(UserActions.checkExistUser({}).type, checkExistUser)
    yield takeLatest(UserActions.registerAccount({}).type, registerAccount)
    yield takeLatest(UserActions.signinFacebook({}).type, signinFacebook)
    yield takeLatest(UserActions.getUserInfo({}).type, getUserInfo)
    yield takeLatest(UserActions.updateUser({}).type, updateUser)
}

function* signIn(action:AnyAction):Generator {
    const { param, resolve, reject } = action.payload
    try{
        const response = yield apiRequest(apiUrl.user.signin, param, 'general')
        if(response) {
            yield put(UserActions.signinSuccess((response as ResponseFormatItem).data))
        }
        yield put(AppActions.openLoading(false))
        if (resolve) yield resolve(response)
    }
    catch(err) {
        yield put(AppActions.openLoading(false))
        if (reject) yield reject(err)
    }
}

function* checkExistUser(action:AnyAction):Generator {
    const { param, resolve, reject } = action.payload
    try{
        const response = yield apiRequest(apiUrl.user.checkExistUser, param, 'general')
        yield put(AppActions.openLoading(false))
        if (resolve) yield resolve(response)
    }
    catch(err) {
        yield put(AppActions.openLoading(false))
        if (reject) yield reject(err)
    }
}

function* registerAccount(action:AnyAction):Generator {
    const { param, resolve, reject } = action.payload
    try{
        const response = yield apiRequest(apiUrl.user.register, param, 'general')
        yield put(AppActions.openLoading(false))
        if (resolve) yield resolve(response)
    }
    catch(err) {
        yield put(AppActions.openLoading(false))
        if (reject) yield reject(err)
    }
}

function* signinFacebook(action:AnyAction):Generator {
    const { param, resolve, reject } = action.payload
    try{
        // yield put(push("http://localhost:1203/v1/user/auth/facebook/callback"))
        const response = yield apiRequest(apiUrl.user.signinFacebook, param, 'general')
        yield put(AppActions.openLoading(false))
        if (resolve) yield resolve(response)
    }
    catch(err) {
        yield put(AppActions.openLoading(false))
        if (reject) yield reject(err)
    }
}

function* getUserInfo(action:AnyAction):Generator {
    const { param, resolve, reject } = action.payload
    try{
        const response = yield apiRequest(apiUrl.user.getUserInfo, param, 'general')
        if(response) {
            yield put(UserActions.getUserInfoSuccess((response as ResponseFormatItem).data))
        }
        yield put(AppActions.openLoading(false))
        if (resolve) yield resolve(response)
    }
    catch(err) {
        yield put(AppActions.openLoading(false))
        if (reject) yield reject(err)
    }
}

function* updateUser(action:AnyAction):Generator {
    const { param, resolve, reject } = action.payload
    try{
        const response = yield apiRequest(apiUrl.user.updateUser, param, 'general')
        yield put(AppActions.openLoading(false))
        if (resolve) yield resolve(response)
    }
    catch(err) {
        yield put(AppActions.openLoading(false))
        if (reject) yield reject(err)
    }
}

