
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
}

function* sendMessages(action: AnyAction): Generator {
    const { param, resolve, reject } = action.payload
    try {
        const response:any = yield apiRequest(apiUrl.interactions.sendMessage, param, 'general')
        if(param.room_id) {
            yield put(InteractionsActions.sendMessagesSuccess({...response.data, interaction_state: 'update'}))
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
        // yield put(InteractionsActions.getAllLatestMessagesSuccess((response as ResponseFormatItem).data))
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
        const response:any = yield apiRequest(apiUrl.interactions.getLatestMessageOfRoom, {room_id: param.room_id}, 'general')
        yield put(InteractionsActions.sendMessagesSuccess({...response.data, interaction_state: 'create', currentUser: param.currentUser, interaction_index: param.interaction_index}))
        yield put(AppActions.openLoading(false))
        if (resolve) yield resolve(response)
    }
    catch (err) {
        yield put(AppActions.openLoading(false))
        if (reject) yield reject(err)
    }
}




