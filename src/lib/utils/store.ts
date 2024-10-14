import { combineReducers, configureStore } from "@reduxjs/toolkit";
import postReducer from "./reducers/postReducer";

const rootReducer = combineReducers({
  post: postReducer,
});

const store = configureStore({
  reducer: rootReducer,
});

export type AppDispatch = typeof store.dispatch;
export type RootState = ReturnType<typeof store.getState>;

export default store;
