
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
import { InteractionsActions } from "../../reducers/listReducer/interactionReducer";

export function* InteractionSaga(): Generator {
    yield takeLatest(InteractionsActions.sendMessages({}).type, sendMessages)
    yield takeLatest(InteractionsActions.getAllLatestMessages({}).type, getAllLatestMessages)
    yield takeLatest(InteractionsActions.getLatestMessageOfRoom({}).type, getLatestMessageOfRoom)
    yield takeLatest(InteractionsActions.getUnreadMessages({}).type, getUnreadMessages)
    yield takeLatest(InteractionsActions.getMessagesDetail({}).type, getMessagesDetail)
    yield takeLatest(InteractionsActions.getRoomDetail({}).type, getRoomDetail)
    yield takeLatest(InteractionsActions.seenMessage({}).type, seenMessage)
}

function* sendMessages(action: AnyAction): Generator {
    const { param, resolve, reject } = action.payload
    try {
        const response:any = yield apiRequest(apiUrl.interactions.sendMessage, param, 'general')
        if(param.room_id) {
            yield put(InteractionsActions.sendMessagesSuccess(response.data))
        }
        yield put(AppActions.openLoading(false))
        if (resolve) yield resolve(response)
    }
    catch (err) {
        yield put(AppActions.openLoading(false))
        if (reject) yield reject(err)
    }
}

function* getAllLatestMessages(action: AnyAction): Generator {
    const { param, resolve, reject } = action.payload
    try {
        const response = yield apiRequest(apiUrl.interactions.getAllLatestMessages, param, 'general')
        yield put(AppActions.openLoading(false))
        if (resolve) yield resolve(response)
    }
    catch (err) {
        yield put(AppActions.openLoading(false))
        if (reject) yield reject(err)
    }
}

function* getLatestMessageOfRoom(action: AnyAction): Generator {
    const { param, resolve, reject } = action.payload
    try {
        const response:any = yield apiRequest(apiUrl.interactions.getLatestMessageOfRoom, param, 'general')
        yield put(InteractionsActions.sendMessagesSuccess(response.data))
        
        yield put(AppActions.openLoading(false))
        if (resolve) yield resolve(response)
    }
    catch (err) {
        yield put(AppActions.openLoading(false))
        if (reject) yield reject(err)
    }
}

function* getUnreadMessages(action: AnyAction): Generator {
    const { param, resolve, reject } = action.payload
    try {
        const response:any = yield apiRequest(apiUrl.interactions.getUnreadMessages, param, 'general')
        yield put(InteractionsActions.getUnreadMessagesSuccess((response as ResponseFormatItem).data))
        yield put(AppActions.openLoading(false))
        if (resolve) yield resolve(response)
    }
    catch (err) {
        yield put(AppActions.openLoading(false))
        if (reject) yield reject(err)
    }
}

function* getMessagesDetail(action: AnyAction): Generator {
    const { param, resolve, reject } = action.payload
    try {
        const roomID = param?.search_list?.find((item: any) => item.name_field === 'room_id')?.value_search
        const response:any = yield apiRequest(apiUrl.interactions.getMessagesDetail, param, 'general')
        if(param?.page > 1) {
            yield put(InteractionsActions.getMessagesDetailSuccess({data: response.data, room_id: roomID}))
        }
        yield put(AppActions.openLoading(false))
        if (resolve) yield resolve(response)
    }
    catch (err) {
        yield put(AppActions.openLoading(false))
        if (reject) yield reject(err)
    }
}

function* getRoomDetail(action: AnyAction): Generator {
    const { param, resolve, reject } = action.payload
    try {
        const response:any = yield apiRequest(apiUrl.interactions.getRoomDetail, param, 'general')
        // yield put(InteractionsActions.sendMessagesSuccess((response as ResponseFormatItem).data))
        yield put(AppActions.openLoading(false))
        if (resolve) yield resolve(response)
    }
    catch (err) {
        yield put(AppActions.openLoading(false))
        if (reject) yield reject(err)
    }
}

function* seenMessage(action: AnyAction): Generator {
    const { param, resolve, reject } = action.payload
    try {
        const response:any = yield apiRequest(apiUrl.interactions.seenMessage, {room_id: param.room_id}, 'general')
        yield put(InteractionsActions.seenMessageSuccess(param))
        yield put(AppActions.openLoading(false))
        if (resolve) yield resolve(response)
    }
    catch (err) {
        yield put(AppActions.openLoading(false))
        if (reject) yield reject(err)
    }
}



