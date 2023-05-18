
import { call, put, takeLatest } from "redux-saga/effects";
import { apiRequest } from "../../utils/apiRequest";
import { apiUrl } from "../../constants";
import { AppActions } from "../../reducers/listReducer/appReducer";
import { AnyAction } from "@reduxjs/toolkit";
import { UserActions } from "../../reducers/listReducer/userReducer";
import { ResponseFormatItem } from "../../interface";
import { CategoryActions } from "../../reducers/listReducer/categoryReducer";


export function* CategoriesSagas():Generator {
    yield takeLatest(CategoryActions.getAllCategories({}).type, getAllCategories)
    yield takeLatest(CategoryActions.getAllSkillsets({}).type, getAllSkillsets)
    yield takeLatest(CategoryActions.getAllSkillsetForNewFreelance({}).type, getAllSkillsetForNewFreelance)
    yield takeLatest(CategoryActions.getAllSkillsetForUser({}).type, getAllSkillsetForUser)
    yield takeLatest(CategoryActions.createDeleteSkillsetForUser({}).type, createDeleteSkillsetForUser)
}

function* getAllCategories(action:AnyAction):Generator {
    const { param, resolve, reject } = action.payload
    try{
        const response = yield apiRequest(apiUrl.categories.getAll, param, 'general')
        if(response) {
            yield put(CategoryActions.getAllCategoriesSuccess((response as ResponseFormatItem).data))
        }
        yield put(AppActions.openLoading(false))
        if (resolve) yield resolve(response)
    }
    catch(err) {
        yield put(AppActions.openLoading(false))
        if (reject) yield reject(err)
    }
}


function* getAllSkillsets(action:AnyAction):Generator {
    const { param, resolve, reject } = action.payload
    try{
        const response = yield apiRequest(apiUrl.categories.getAllSkillsets, param, 'general')
        if(response) {
            yield put(CategoryActions.getAllSkillsetsSuccess((response as ResponseFormatItem).data))
        }
        yield put(AppActions.openLoading(false))
        if (resolve) yield resolve(response)
    }
    catch(err) {
        yield put(AppActions.openLoading(false))
        if (reject) yield reject(err)
    }
}

function* getAllSkillsetForNewFreelance(action:AnyAction):Generator {
    const { param, resolve, reject } = action.payload
    try{
        const response = yield apiRequest(apiUrl.categories.getAllSkillsetForNewFreelance, param, 'general')
        yield put(AppActions.openLoading(false))
        if (resolve) yield resolve(response)
    }
    catch(err) {
        yield put(AppActions.openLoading(false))
        if (reject) yield reject(err)
    }
}


function* getAllSkillsetForUser(action: AnyAction): Generator {
    const { param, resolve, reject } = action.payload
    try {
        const response = yield apiRequest(apiUrl.categories.skillset.getAll, param, 'general')
        yield put(CategoryActions.getAllSkillsetForUserSuccess((response as ResponseFormatItem).data))
        yield put(AppActions.openLoading(false))
        if (resolve) yield resolve(response)
    }
    catch (err) {
        yield put(AppActions.openLoading(false))
        if (reject) yield reject(err)
    }
}

function* createDeleteSkillsetForUser(action: AnyAction): Generator {
    const { param, resolve, reject } = action.payload
    try {
        const response = yield apiRequest(apiUrl.categories.skillset.createDelete, param, 'general')
        yield put(CategoryActions.createDeleteSkillsetForUserSuccess((response as ResponseFormatItem).data))
        yield put(AppActions.openLoading(false))
        if (resolve) yield resolve(response)
    }
    catch (err) {
        yield put(AppActions.openLoading(false))
        if (reject) yield reject(err)
    }
}

