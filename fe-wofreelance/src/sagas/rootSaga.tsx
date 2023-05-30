
import { all } from 'redux-saga/effects'
import { CategoriesSagas } from './listSaga/categorySaga'
import { UserTaskSaga } from './listSaga/userSaga'
import { ExperienceSaga } from './listSaga/experienceSaga'
import { EducationSaga } from './listSaga/educationSaga'
import { QualificationSaga } from './listSaga/qualificationSaga'
import { LocationSaga } from './listSaga/locationSaga'

export default function* rootSaga(){
    yield all([
        UserTaskSaga(),
        CategoriesSagas(),
        ExperienceSaga(),
        EducationSaga(),
        QualificationSaga(),
        LocationSaga()
    ])
}