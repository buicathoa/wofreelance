import createSagaMiddleware from "@redux-saga/core";
import { configureStore, combineReducers } from "@reduxjs/toolkit";
import { routerMiddleware, routerReducer } from 'react-router-redux';
// import { createRouterMiddleware, routerReducer } from "connected-next-router";
import rootSaga from "../sagas/rootSaga";
import AppReducer from "./appReducer";
import UserReducer from "./userReducer";
import CategoryReducer from "./categoryReducer";

const rootReducer = combineReducers({
    app: AppReducer,
    user: UserReducer,
    category: CategoryReducer
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