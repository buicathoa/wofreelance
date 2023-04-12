import createSagaMiddleware from "@redux-saga/core";
import { configureStore, combineReducers } from "@reduxjs/toolkit";
import { createRouterMiddleware, routerReducer } from "connected-next-router";
import rootSaga from "../sagas/rootSaga";
// import rootSaga from "../saga/rootSaga";
import AppReducer from "./appReducer";
// import AuthReducer from "./authReducer";
// import CartReducer from "./cartReducer";
// import GeneralMenuReducer from "./generalMenuReducer";
// import LocationReducer from "./LocationReducer";
// import MenuRegisterReducer from "./MenuRegisterReducer";
// import orderReducer from "./orderReducer";
// import ProductReducer from "./ProductReducer";
// import UserReducer from "./userReducer";

const rootReducer = combineReducers({
    // router: routerReducer,
    // generalMenu: GeneralMenuReducer,
    // product: ProductReducer,
    // cart: CartReducer,
    // auth: AuthReducer,
    app: AppReducer,
    // user: UserReducer,
    // location: LocationReducer,
    // order: orderReducer,
    // MenuRegister: MenuRegisterReducer
})

const sagaMiddleware = createSagaMiddleware();
// const routerMiddleware = createRouterMiddleware()
const store = configureStore({
    reducer: rootReducer,
    middleware: (getDefaultMiddleware) => getDefaultMiddleware({
        serializableCheck: false
    }).concat(sagaMiddleware),
})

export type AppDispatch = typeof store.dispatch;
export type RootState = ReturnType<typeof store.getState>;

sagaMiddleware.run(rootSaga);

export default store;