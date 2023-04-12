
import { all } from 'redux-saga/effects'
// import { FollowFetchAuth } from './AuthSaga'
// import { FollowFetchCart } from './CartSaga'
// import { FollowFetchGeneralMenu } from './generalMenuSaga'
// import { FollowFetchLocation } from './LocationSaga'
// import { FollowMenuRegister } from './MenuRegisterSaga'
// import { FollowFetchOrder } from './OrderSaga'
// import { FollowFetchProduct } from './ProductSaga'
// import { FollowFetchUser } from './UserSaga'

export default function* rootSaga(){
    yield all([
        // FollowFetchGeneralMenu(),
        // FollowFetchProduct(),
        // FollowFetchCart(),
        // FollowFetchAuth(),
        // FollowFetchUser(),
        // FollowFetchLocation(),
        // FollowFetchOrder(),
        // FollowMenuRegister()
    ])
}