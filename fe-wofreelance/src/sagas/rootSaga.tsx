
import { all } from 'redux-saga/effects'
import { UserTaskSaga } from './userSaga'
import { CategoriesSagas } from './categorySaga'

export default function* rootSaga(){
    yield all([
        UserTaskSaga(),
        CategoriesSagas()
    ])
}