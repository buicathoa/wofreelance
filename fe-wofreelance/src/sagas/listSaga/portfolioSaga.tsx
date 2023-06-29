
import { select , put, takeLatest } from "redux-saga/effects";
import { push } from 'react-router-redux';
import { apiRequest } from "../../utils/apiRequest";
import { HREF, apiUrl } from "../../constants";
import { AppActions } from "../../reducers/listReducer/appReducer";
import { AnyAction } from "@reduxjs/toolkit";
import { UserActions } from "../../reducers/listReducer/userReducer";
import { ResponseFormatItem } from "../../interface";
import { PortfolioActions } from "../../reducers/listReducer/portfolioReducer";

export function* PortfolioSaga(): Generator {
    yield takeLatest(PortfolioActions.getPortfolios({}).type, getPortfolios)
    yield takeLatest(PortfolioActions.createPortfolio({}).type, createPortfolio)
    yield takeLatest(PortfolioActions.deletePortfolio({}).type, deletePortfolio)
    yield takeLatest(PortfolioActions.updatePortfolio({}).type, updatePortfolio)
}

function* getPortfolios(action: AnyAction): Generator {
    const { param, resolve, reject } = action.payload
    try {
        const response = yield apiRequest(apiUrl.portfolio.getAll, param, 'general')
        yield put(PortfolioActions.getPortfoliosSuccess((response as ResponseFormatItem).data))

        yield put(AppActions.openLoading(false))
        if (resolve) yield resolve(response)
    }
    catch (err) {
        yield put(AppActions.openLoading(false))
        if (reject) yield reject(err)
    }
}

function* createPortfolio(action: AnyAction): Generator {
    const { param, resolve, reject } = action.payload
    try {
        const response = yield apiRequest(apiUrl.portfolio.create, param, 'general')
        yield put(AppActions.openLoading(false))
        if (resolve) yield resolve(response)
    }
    catch (err) {
        yield put(AppActions.openLoading(false))
        if (reject) yield reject(err)
    }
}

function* deletePortfolio(action: AnyAction): Generator {
    const { param, resolve, reject } = action.payload
    try {
        const response = yield apiRequest(apiUrl.portfolio.delete, param, 'general')
        yield put(AppActions.openLoading(false))
        if (resolve) yield resolve(response)
    }
    catch (err) {
        yield put(AppActions.openLoading(false))
        if (reject) yield reject(err)
    }
}

function* updatePortfolio(action: AnyAction): Generator {
    const { param, resolve, reject } = action.payload
    try {
        const response = yield apiRequest(apiUrl.portfolio.update, param, 'general')
        yield put(AppActions.openLoading(false))
        if (resolve) yield resolve(response)
    }
    catch (err) {
        yield put(AppActions.openLoading(false))
        if (reject) yield reject(err)
    }
}


