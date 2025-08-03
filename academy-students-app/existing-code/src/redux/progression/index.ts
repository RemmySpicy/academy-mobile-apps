import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface ProgressState {
  isLoading: boolean;
}

const initialState: ProgressState = {
  isLoading: false,
};

export const ProgressSlice = createSlice({
  name: "progress",
  initialState,
  reducers: {
    setProgress: (state: ProgressState, action: PayloadAction<boolean>) => {
      state.isLoading = action.payload;
    },
  },
});

export default ProgressSlice.reducer;
export const { setProgress } = ProgressSlice.actions;

export const selectIsLoading = (state: { progress: ProgressState }) =>
  state.progress.isLoading;
