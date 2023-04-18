
import { call, put, takeLatest } from "redux-saga/effects";
import { apiRequest } from "../utils/apiRequest";
import { apiUrl } from "../constants";
import { AppActions } from "../reducers/appReducer";
import { AnyAction } from "@reduxjs/toolkit";
import { UserActions } from "../reducers/userReducer";
import { ResponseFormatItem } from "../interface";
import { CategoryActions } from "../reducers/categoryReducer";


export function* CategoriesSagas():Generator {
    yield takeLatest(CategoryActions.getAllCategories({}).type, getAllCategories)
    yield takeLatest(CategoryActions.getAllSubcategories({}).type, getAllSubcategories)
    yield takeLatest(CategoryActions.getAllSkillsets({}).type, getAllSkillsets)
    yield takeLatest(CategoryActions.getAllSkillsetForNewFreelance({}).type, getAllSkillsetForNewFreelance)
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

function* getAllSubcategories(action:AnyAction):Generator {
    const { param, resolve, reject } = action.payload
    try{
        const response = yield apiRequest(apiUrl.categories.getAllSubcategories, param, 'general')
        if(response) {
            yield put(CategoryActions.getAllSubcategories((response as ResponseFormatItem).data))
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

