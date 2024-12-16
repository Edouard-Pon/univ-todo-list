import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { login, register } from "./userThunks";
import { RootState } from "./store";
import { User } from "./types";

export interface UserState {
  user: User | null;
  isAuth: boolean;
  token: string | null;
  status: 'idle' | 'loading' | 'succeeded' | 'failed';
  error: string | null;
}

const initialState: UserState = {
  user: null,
  isAuth: false,
  token: null,
  status: 'idle',
  error: null
}

export const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    logout: (state) => {
      state.user = null;
    },
    clearStatus: (state) => {
      state.status = 'idle';
      state.error = null;
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(login.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(login.fulfilled, (state, action: PayloadAction<{ token: string; user: User }>) => {
        // state.token = action.payload.token;
        state.isAuth = true;
        state.user = action.payload.user;
        state.status = 'succeeded';
        state.error = null;
      })
      .addCase(login.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.error.message ?? null;
      })
      .addCase(register.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(register.fulfilled, (state, action: PayloadAction<{ token: string; user: User }>) => {
        state.status = 'succeeded';
        state.user = action.payload.user;
        state.token = action.payload.token;
        state.isAuth = true;
      })
      .addCase(register.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.error.message ?? null;
      })
  }
})

export const { logout, clearStatus } = userSlice.actions;

export const selectAuth = (state: RootState) => state.user.isAuth;
export const selectUser = (state: RootState) => state.user.user;
export const selectStatus = (state: RootState) => state.user.status;

export default userSlice.reducer;
