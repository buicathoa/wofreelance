
import { select, put, takeLatest } from "redux-saga/effects";
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
import { PostActions } from "../../reducers/listReducer/postReducer";
import { openError } from "../../components/Notifications";

export function* PostSaga(): Generator {
    yield takeLatest(PostActions.createPost({}).type, createPost)
    yield takeLatest(PostActions.getPostDetail({}).type, getPostDetail)
    
    yield takeLatest(PostActions.getallBid({}).type, getallBid)

    yield takeLatest(PostActions.biddingPost({}).type, biddingPost)
    yield takeLatest(PostActions.updateBid({}).type, updateBid)
    yield takeLatest(PostActions.deleteBid({}).type, deleteBid)

    yield takeLatest(PostActions.createAwardBid({}).type, createAwardBid)
    yield takeLatest(PostActions.getAllPersonalBiddings({}).type, getAllPersonalBiddings)
}

    function* createPost(action: AnyAction): Generator {
        const { param, resolve, reject } = action.payload
        try {
            const response = yield apiRequest(apiUrl.post.create, param, 'general')
            // yield put(AppActions.getCurrenciesSuccess((response as ResponseFormatItem).data))
            yield put(AppActions.openLoading(false))
            if (resolve) yield resolve(response)
        }
        catch (err) {
            yield put(AppActions.openLoading(false))
            if (reject) yield reject(err)
        }
    }

    function* getPostDetail(action: AnyAction): Generator {
        const { param, resolve, reject } = action.payload
        try {
            const response = yield apiRequest(apiUrl.post.getDetail, param, 'general')
            // yield put(AppActions.getCurrenciesSuccess((response as ResponseFormatItem).data))
            yield put(AppActions.openLoading(false))
            if (resolve) yield resolve(response)
        }
        catch (err) {
            yield put(AppActions.openLoading(false))
            if (reject) yield reject(err)
        }
    }

    function* getallBid(action: AnyAction): Generator {
        const { param, resolve, reject } = action.payload
        try {
            const response = yield apiRequest(apiUrl.post.bidding.getallBid, param, 'general')
            yield put(PostActions.getallBidSuccess((response as ResponseFormatItem).data))
            // yield put(AppActions.getCurrenciesSuccess((response as ResponseFormatItem).data))
            yield put(AppActions.openLoading(false))
            if (resolve) yield resolve(response)
        }
        catch (err) {
            yield put(AppActions.openLoading(false))
            if (reject) yield reject(err)
        }
    }

    function* biddingPost(action: AnyAction): Generator {
        const { param, resolve, reject } = action.payload
        try {
            const response = yield apiRequest(apiUrl.post.bidding.create, param, 'general')
            yield put(PostActions.biddingPostSuccess((response as ResponseFormatItem).data))
            yield put(AppActions.openLoading(false))
            if (resolve) yield resolve(response)
        }
        catch (err: any) {
            yield put(AppActions.openLoading(false))
            openError({notiMess: err.response.data.message})
            if (reject) yield reject(err)
        }
    }

    function* updateBid(action: AnyAction): Generator {
        const { param, resolve, reject } = action.payload
        try {
            const response = yield apiRequest(apiUrl.post.bidding.update, param, 'general')
            yield put(PostActions.updateBidSuccess((response as ResponseFormatItem).data))
            yield put(AppActions.openLoading(false))
            if (resolve) yield resolve(response)
        }
        catch (err: any) {
            yield put(AppActions.openLoading(false))
            openError({notiMess: err.response.data.message})
            if (reject) yield reject(err)
        }
    }
    
    function* deleteBid(action: AnyAction): Generator {
        const { param, resolve, reject } = action.payload
        try {
            const response = yield apiRequest(apiUrl.post.bidding.delete, param, 'general')
            yield put(PostActions.deleteBidSuccess(param))
            yield put(AppActions.openLoading(false))
            if (resolve) yield resolve(response)
        }
        catch (err: any) {
            yield put(AppActions.openLoading(false))
            openError({notiMess: err.response.data.message})
            if (reject) yield reject(err)
        }
    } 

    function* createAwardBid(action: AnyAction): Generator {
        const { param, resolve, reject } = action.payload
        try {
            const response = yield apiRequest(apiUrl.post.bidding.createAwardBid, param, 'general')
            yield put(PostActions.createAwardBidSuccess((response as ResponseFormatItem).data))
            yield put(AppActions.openLoading(false))
            if (resolve) yield resolve(response)
        }
        catch (err: any) {
            yield put(AppActions.openLoading(false))
            openError({notiMess: err.response.data.message})
            if (reject) yield reject(err)
        }
    } 

    function* getAllPersonalBiddings(action: AnyAction): Generator {
        const { param, resolve, reject } = action.payload
        try {
            const response = yield apiRequest(apiUrl.post.bidding.getAllPersonalBiddings, param, 'general')
            yield put(PostActions.getAllPersonalBiddingsSuccess((response as ResponseFormatItem).data))
            yield put(AppActions.openLoading(false))
            if (resolve) yield resolve(response)
        }
        catch (err: any) {
            yield put(AppActions.openLoading(false))
            openError({notiMess: err.response.data.message})
            if (reject) yield reject(err)
        }
    }
    
