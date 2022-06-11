import { configureStore } from "@reduxjs/toolkit";
import { TypedUseSelectorHook, useDispatch, useSelector } from "react-redux";
import accountSliceReducer from "./accountSlice";
import basketSliceReducer from "./basketSlice";
import catalogSliceReducer from "./catalogSlice";

const store = configureStore({
  reducer: {
    basket: basketSliceReducer,
    catalog: catalogSliceReducer,
    account: accountSliceReducer,
  },
});

export default store;

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;
export const useAppDispatch = () => useDispatch<AppDispatch>();
