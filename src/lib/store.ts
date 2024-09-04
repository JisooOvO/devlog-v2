import { combineReducers, configureStore } from "@reduxjs/toolkit";
import categoryReducer from "./store/categoryReducer";

const rootReducer = combineReducers({
  category: categoryReducer,
});

const store = configureStore({
  reducer: rootReducer,
});

export type AppDispatch = typeof store.dispatch;
export type RootState = ReturnType<typeof store.getState>;

export default store;
