import {configureStore} from "@reduxjs/toolkit";
import {TypedUseSelectorHook, useSelector} from "react-redux";
import messageReducer from "./features/messages-slice";

export const chatbotStore = configureStore({
  reducer: {
    messageReducer,
  },
});

export type RootState = ReturnType<typeof chatbotStore.getState>;
export type AppDispatch = typeof chatbotStore.dispatch;

export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;
