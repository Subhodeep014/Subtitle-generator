import { configureStore, combineReducers } from "@reduxjs/toolkit";
import userReducer from '../redux/user/userSlice.js'
import themeReducer from '../redux/theme/themeSlice.js'
import verifyReducer from '../redux/user/verifySlice.js'
import { persistReducer } from "redux-persist";
import storage from "redux-persist/lib/storage";
import persistStore from "redux-persist/es/persistStore";

const rootReducer = combineReducers({
    user : userReducer,
    theme : themeReducer,
    email : verifyReducer
})
const persistConfig = {
    key : 'root',
    storage,
    version : 1
}
const persistedReducer = persistReducer(persistConfig, rootReducer);
export const store = configureStore({
    reducer: persistedReducer,
    middleware: (getDefaultMiddleware)=> getDefaultMiddleware({serializableCheck: false}),
})

export const persistor = persistStore(store);