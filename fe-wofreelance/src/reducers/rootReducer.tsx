import createSagaMiddleware from "@redux-saga/core";
import { configureStore, combineReducers } from "@reduxjs/toolkit";
import { routerMiddleware, routerReducer } from 'react-router-redux';
// import { createRouterMiddleware, routerReducer } from "connected-next-router";
import rootSaga from "../sagas/rootSaga";
import AppReducer from "./listReducer/appReducer";
import UserReducer from "./listReducer/userReducer";
import CategoryReducer from "./listReducer/categoryReducer";
import ExperienceReducer from "./listReducer/experienceReducer";
import EducationReducer from "./listReducer/educationReducer";
import QualificationReducer from "./listReducer/qualificationReducer";
import LocationReducer from "./listReducer/locationReducer";
import PostReducer from "./listReducer/postReducer";
import PortfolioReducer from "./listReducer/portfolioReducer";
import NotificationsReducer from "./listReducer/notificationsReducer";
import InteractionsReducer from "./listReducer/interactionReducer";

const sagaMiddleware = createSagaMiddleware();
const rootReducer = combineReducers({
    app: AppReducer,
    user: UserReducer,
    category: CategoryReducer,
    experience: ExperienceReducer,
    education: EducationReducer,
    qualification: QualificationReducer,
    location: LocationReducer,
    post: PostReducer,
    portfolio: PortfolioReducer,
    notifications: NotificationsReducer,
    interactions: InteractionsReducer
})

const store = configureStore({
    reducer: rootReducer,
    middleware: (getDefaultMiddleware) => getDefaultMiddleware({
        serializableCheck: false
    }).concat(sagaMiddleware),
})

// const routerMiddleware = createRouterMiddleware()

export type AppDispatch = typeof store.dispatch;
export type RootState = ReturnType<typeof store.getState>;

sagaMiddleware.run(rootSaga);

export default store;