
import { select , put, takeLatest, call } from "redux-saga/effects";
import { push } from 'react-router-redux';
import { apiRequest } from "../../utils/apiRequest";
import { HREF, apiUrl } from "../../constants";
import { AppActions } from "../../reducers/listReducer/appReducer";
import { AnyAction } from "@reduxjs/toolkit";
import { UserActions } from "../../reducers/listReducer/userReducer";
import { ResponseFormatItem } from "../../interface";

export function* UserTaskSaga(): Generator {
    // yield takeLatest(GeneralMenuActions.fetchAllGeneralMenu().type, fetchAllGeneralMenus)
    yield takeLatest(UserActions.signin({}).type, signIn)
    yield takeLatest(UserActions.signout({}).type, signout)
    yield takeLatest(UserActions.checkExistUser({}).type, checkExistUser)
    yield takeLatest(UserActions.registerAccount({}).type, registerAccount)
    yield takeLatest(UserActions.signinFacebook({}).type, signinFacebook)
    yield takeLatest(UserActions.signinFacebookTK({}).type, signinFacebookTK)
    yield takeLatest(UserActions.getUserInfo({}).type, getUserInfo)
    yield takeLatest(UserActions.getUserInfoDestination({}).type, getUserInfoDestination)
    yield takeLatest(UserActions.updateUser({}).type, updateUser)
    yield takeLatest(UserActions.getAllLanguages({}).type, getAllLanguages)
    yield takeLatest(UserActions.generatedAddress({}).type, generatedAddress)

    //educations
    yield takeLatest(UserActions.createEducation({}).type, createEducation)
    yield takeLatest(UserActions.deleteEducation({}).type, deleteEducation)
    yield takeLatest(UserActions.updateEducation({}).type, updateEducation)
    yield takeLatest(UserActions.getAllEducationUser({}).type, getAllEducationUser)
    yield takeLatest(UserActions.getAllEducation({}).type, getAllEducation)

    //experiences
    yield takeLatest(UserActions.createExperience({}).type, createExperience)
    yield takeLatest(UserActions.deleteExperience({}).type, deleteExperience)
    yield takeLatest(UserActions.updateExperience({}).type, updateExperience)

    //portfolios
    yield takeLatest(UserActions.createPortfolio({}).type, createPortfolio)
    yield takeLatest(UserActions.deletePortfolio({}).type, deletePortfolio)
    yield takeLatest(UserActions.updatePortfolio({}).type, updatePortfolio)

    //qualifications
    yield takeLatest(UserActions.createQualification({}).type, createQualification)
    yield takeLatest(UserActions.deleteQualification({}).type, deleteQualification)
    yield takeLatest(UserActions.updateQualification({}).type, updateQualification)

    //skills
    yield takeLatest(UserActions.getAllSkillsetForUser({}).type, getAllSkillsetForUser)
    yield takeLatest(UserActions.createDeleteSkillsetForUser({}).type, createDeleteSkillsetForUser)
}

function* signIn(action: AnyAction): Generator {
    const { param, resolve, reject } = action.payload
    try {
        const response:any = yield apiRequest(apiUrl.user.signin, param, 'general')
        if (response) {
            yield put(UserActions.signinSuccess((response as ResponseFormatItem).data))
            yield call([localStorage, 'setItem'], 'access_token', response?.data.token);
        }
        yield put(AppActions.openLoading(false))
        if (resolve) yield resolve(response)
    }
    catch (err) {
        yield put(AppActions.openLoading(false))
        if (reject) yield reject(err)
    }
}

function* signout(action: AnyAction): Generator {
    const { param, resolve, reject } = action.payload
    try {
        const response = yield apiRequest(apiUrl.user.signout, param, 'general')
        // yield put(UserActions.signoutSuccess(false))
        yield put(AppActions.openLoading(false))
        if (resolve) yield resolve(response)
    }
    catch (err) {
        yield put(AppActions.openLoading(false))
        if (reject) yield reject(err)
    }
}


function* checkExistUser(action: AnyAction): Generator {
    const { param, resolve, reject } = action.payload
    try {
        const response = yield apiRequest(apiUrl.user.checkExistUser, param, 'general')
        yield put(AppActions.openLoading(false))
        if (resolve) yield resolve(response)
    }
    catch (err) {
        yield put(AppActions.openLoading(false))
        if (reject) yield reject(err)
    }
}

function* registerAccount(action: AnyAction): Generator {
    const { param, resolve, reject } = action.payload
    try {
        const response = yield apiRequest(apiUrl.user.register, param, 'general')
        yield put(AppActions.openLoading(false))
        if (resolve) yield resolve(response)
    }
    catch (err) {
        yield put(AppActions.openLoading(false))
        if (reject) yield reject(err)
    }
}

function* signinFacebook(action: AnyAction): Generator {
    const { param, resolve, reject } = action.payload
    try {
        // yield put(push("http://localhost:1203/v1/user/auth/facebook/callback"))
        const response = yield apiRequest(apiUrl.user.signinFacebook, param, 'general')
        yield put(AppActions.openLoading(false))
        if (resolve) yield resolve(response)
    }
    catch (err) {
        yield put(AppActions.openLoading(false))
        if (reject) yield reject(err)
    }
}

function* signinFacebookTK(action: AnyAction): Generator {
    const { param, resolve, reject } = action.payload
    try {
        // yield put(push("http://localhost:1203/v1/user/auth/facebook/callback"))
        const response = yield apiRequest(apiUrl.user.signinFacebookTK, param, 'general')
        yield put(AppActions.openLoading(false))
        if (resolve) yield resolve(response)
    }
    catch (err) {
        yield put(AppActions.openLoading(false))
        if (reject) yield reject(err)
    }
}

function* getUserInfo(action: AnyAction): Generator {
    const { param, resolve, reject } = action.payload
    try {
        let payload = {...param}
        if(param?.isOwner) {
            delete payload['isOwner']
        }
        const response:any = yield apiRequest(apiUrl.user.getUserInfo, payload, 'general')
        if(!param?.isOwner) {
            yield put(UserActions.getUserInfoSuccess((response as ResponseFormatItem).data))
            yield put(AppActions.getNotificationsSuccess((response as ResponseFormatItem).data.noti_count))
        }
        yield put(UserActions.getUserInforDestinationSuccess((response as ResponseFormatItem).data))
        yield put(AppActions.openLoading(false))
        if (resolve) yield resolve(response)
    }
    catch (err) {
        yield put(AppActions.openLoading(false))
        if (reject) yield reject(err)
    }
}

function* getUserInfoDestination(action: AnyAction): Generator {
    const { param, resolve, reject } = action.payload
    try {
        const response:any = yield apiRequest(apiUrl.user.getUserInfoDestination, param, 'general')
        yield put(UserActions.getUserInforDestinationSuccess((response as ResponseFormatItem).data))
        yield put(AppActions.openLoading(false))
        if (resolve) yield resolve(response)
    }
    catch (err) {
        yield put(AppActions.openLoading(false))
        if (reject) yield reject(err)
    }
}

function* updateUser(action: AnyAction): Generator {
    const { param, resolve, reject } = action.payload
    try {
        const response = yield apiRequest(apiUrl.user.updateUser, param, 'general')
        if (response) {
            yield put(UserActions.updateUserSuccess((response as ResponseFormatItem).data))
        }
        yield put(AppActions.openLoading(false))
        if (resolve) yield resolve(response)
    }
    catch (err) {
        yield put(AppActions.openLoading(false))
        if (reject) yield reject(err)
    }
}

function* getAllLanguages(action: AnyAction): Generator {
    const { param, resolve, reject } = action.payload
    try {
        const response = yield apiRequest(apiUrl.user.getAllLanguages, param, 'general')
        if (response) {
            yield put(UserActions.getAllLanguagesSuccess((response as ResponseFormatItem).data))
        }
        yield put(AppActions.openLoading(false))
        if (resolve) yield resolve(response)
    }
    catch (err) {
        yield put(AppActions.openLoading(false))
        if (reject) yield reject(err)
    }
}

function* generatedAddress(action: AnyAction): Generator {
    const { param, resolve, reject } = action.payload
    try {
        const response = yield apiRequest(apiUrl.user.generatedAddress, param, 'general')
        if (response) {
            yield put(UserActions.generatedAddressSuccess((response as ResponseFormatItem).data))
        }
        yield put(AppActions.openLoading(false))
        if (resolve) yield resolve(response)
    }
    catch (err) {
        yield put(AppActions.openLoading(false))
        if (reject) yield reject(err)
    }
}

//educations
function* createEducation(action: AnyAction): Generator {
    const { param, resolve, reject } = action.payload
    try {
        const response = yield apiRequest(apiUrl.education.create, param, 'general')
        yield put(UserActions.createEducationSuccess((response as ResponseFormatItem).data))
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
        yield put(UserActions.deleteEducationSuccess(param))
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
        yield put(UserActions.updateEducationSuccess((response as any).data))
        yield put(AppActions.openLoading(false))
        if (resolve) yield resolve(response)
    }
    catch (err) {
        yield put(AppActions.openLoading(false))
        if (reject) yield reject(err)
    }
}

function* getAllEducation(action: AnyAction): Generator {
    const { param, resolve, reject } = action.payload
    try {
        const response = yield apiRequest(apiUrl.education.getAllEducation, param, 'general')
        yield put(UserActions.getAllEducationSuccess((response as any).data))
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
        yield put(UserActions.getAllEducationUserSuccess((response as ResponseFormatItem).data))

        yield put(AppActions.openLoading(false))
        if (resolve) yield resolve(response)
    }
    catch (err) {
        yield put(AppActions.openLoading(false))
        if (reject) yield reject(err)
    }
}

//experiences
function* createExperience(action: AnyAction): Generator {
    const { param, resolve, reject } = action.payload
    try {
        const response = yield apiRequest(apiUrl.experience.create, param, 'general')
        yield put(UserActions.createExperienceSuccess((response as ResponseFormatItem).data))
        yield put(AppActions.openLoading(false))
        if (resolve) yield resolve(response)
    }
    catch (err) {
        yield put(AppActions.openLoading(false))
        if (reject) yield reject(err)
    }
}

function* deleteExperience(action: AnyAction): Generator {
    const { param, resolve, reject } = action.payload
    try {
        const response = yield apiRequest(apiUrl.experience.delete, param, 'general')
        yield put(UserActions.deleteExperienceSuccess(param))
        yield put(AppActions.openLoading(false))
        if (resolve) yield resolve(response)
    }
    catch (err) {
        yield put(AppActions.openLoading(false))
        if (reject) yield reject(err)
    }
}

function* updateExperience(action: AnyAction): Generator {
    const { param, resolve, reject } = action.payload
    try {
        const response = yield apiRequest(apiUrl.experience.update, param, 'general')
        yield put(UserActions.updateExperienceSuccess(param))
        yield put(AppActions.openLoading(false))
        if (resolve) yield resolve(response)
    }
    catch (err) {
        yield put(AppActions.openLoading(false))
        if (reject) yield reject(err)
    }
}

//portfolios
function* createPortfolio(action: AnyAction): Generator {
    const { param, resolve, reject } = action.payload
    try {
        const response = yield apiRequest(apiUrl.portfolio.create, param, 'general')
        yield put(UserActions.createPortfolioSuccess((response as ResponseFormatItem).data))
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
        yield put(UserActions.deletePortfolioSuccess(param))
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
        yield put(UserActions.updatePortfolioSuccess(param))
        yield put(AppActions.openLoading(false))
        if (resolve) yield resolve(response)
    }
    catch (err) {
        yield put(AppActions.openLoading(false))
        if (reject) yield reject(err)
    }
}

//qualifications
function* createQualification(action: AnyAction): Generator {
    const { param, resolve, reject } = action.payload
    try {
        const response = yield apiRequest(apiUrl.qualification.create, param, 'general')
        yield put(UserActions.createQualificationSuccess((response as ResponseFormatItem).data))
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
        yield put(UserActions.deleteQualificationSuccess(param))
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
        yield put(UserActions.updateQualificationSuccess(param))
        yield put(AppActions.openLoading(false))
        if (resolve) yield resolve(response)
    }
    catch (err) {
        yield put(AppActions.openLoading(false))
        if (reject) yield reject(err)
    }
}

//list skills
function* getAllSkillsetForUser(action: AnyAction): Generator {
    const { param, resolve, reject } = action.payload
    try {
        const response = yield apiRequest(apiUrl.categories.skillset.getAll, param, 'general')
        yield put(UserActions.getAllSkillsetForUserSuccess((response as ResponseFormatItem).data))
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
        yield put(UserActions.createDeleteSkillsetForUserSuccess((response as ResponseFormatItem).data))
        yield put(AppActions.openLoading(false))
        if (resolve) yield resolve(response)
    }
    catch (err) {
        yield put(AppActions.openLoading(false))
        if (reject) yield reject(err)
    }
}
