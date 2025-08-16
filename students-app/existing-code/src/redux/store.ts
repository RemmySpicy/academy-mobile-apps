import { configureStore } from "@reduxjs/toolkit";
import { useDispatch, useSelector, TypedUseSelectorHook } from "react-redux";
import { UtilSlice } from "./utils";
import { AuthSlice } from "./auth";
import { ProgressSlice } from "./progression";

export const store = configureStore({
  reducer: {
    utils: UtilSlice.reducer,
    auth: AuthSlice.reducer,
    progress: ProgressSlice.reducer,
  },
});

export const useAppDispatch: () => typeof store.dispatch = useDispatch;
export const useAppSelector: TypedUseSelectorHook<
  ReturnType<typeof store.getState>
> = useSelector;
