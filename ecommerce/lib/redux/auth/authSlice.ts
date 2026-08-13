import { createSlice } from "@reduxjs/toolkit";
import { getMeThunk, loginThunk, logoutThunk, registerThunk } from "./authThunk";

interface AuthState {
  user: any | null;
  loading: boolean;
  error: string | null;
   token: string | null;
   success: string | null;
   authChecked: boolean;
}

const initialState: AuthState = {
  user: null,
  loading: false,
   token: null,
  error: null,
  success: null,
  authChecked: false,
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    clearAuth(state) {
      state.user = null;
      state.error = null;
      state.token = null;
      state.success = null;
      state.authChecked = true;
    },
    markAuthChecked(state) {
      state.authChecked = true;
      state.loading = false;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(loginThunk.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(loginThunk.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload.user;
        state.token = action.payload.token;
        state.authChecked = true;
        state.error = null;
      })
      .addCase(loginThunk.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
       .addCase(logoutThunk.fulfilled, (state) => {
        state.user = null;
        state.token = null;
        state.error = null;
        state.success = null;
        state.authChecked = true;
      })
      .addCase(registerThunk.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.success = null

      })
      .addCase(registerThunk.fulfilled, (state, action) => {
        state.loading = false;
        state.user = null;
        state.token = null;
        state.success = action.payload.message;
        state.authChecked = true;
      })
      .addCase(registerThunk.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })

      .addCase(getMeThunk.pending, (state) => {
        state.loading = true;
      })
      .addCase(getMeThunk.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload.user;
        state.token = action.payload.token;
        state.authChecked = true;
      })
      .addCase(getMeThunk.rejected, (state) => {
        state.loading = false;
        state.token = null;
        state.user = null;
        state.authChecked = true;
      });
  },
});

export const { clearAuth, markAuthChecked } = authSlice.actions;
export default authSlice.reducer;