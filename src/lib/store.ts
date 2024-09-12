import { combineReducers, configureStore } from "@reduxjs/toolkit";
import categoryReducer from "./store/categoryReducer";
import postReducer from "./store/postReducer";

const rootReducer = combineReducers({
  category: categoryReducer,
  post: postReducer,
});

const store = configureStore({
  reducer: rootReducer,
});

export type AppDispatch = typeof store.dispatch;
export type RootState = ReturnType<typeof store.getState>;

export default store;
