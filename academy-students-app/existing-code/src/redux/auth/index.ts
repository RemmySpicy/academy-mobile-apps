import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { User } from "./interface";

interface AuthState {
  user: User | null;
}

const initialState: AuthState = {
  user: null,
};

export const AuthSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    setUser: (state: AuthState, action: PayloadAction<User | null>) => {
      state.user = action.payload;
    },
  },
});

export const selectUser = (state: { auth: AuthState }) => state.auth.user;

export default AuthSlice.reducer;
export const { setUser } = AuthSlice.actions;
