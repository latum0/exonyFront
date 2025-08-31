// src/store/slices/passwordSlice.ts
import { createSlice } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";
interface PasswordState {
  loading: boolean;
  error: string | null;
  success: boolean;
}


const initialState: PasswordState = {
  loading: false,
  error: null,
  success: false,
};


const passwordSlice = createSlice({
  name: "password",
  initialState,
  reducers: {
    changePasswordStart: (state) => {
      state.loading = true;
      state.error = null;
      state.success = false;
    },
    changePasswordSuccess: (state) => {
      state.loading = false;
      state.success = true;
      state.error = null;
    },
    changePasswordFailure: (state, action: PayloadAction<string>) => {
      state.loading = false;
      state.error = action.payload;
      state.success = false;
    },
    resetPasswordState: (state) => {
      state.loading = false;
      state.error = null;
      state.success = false;
    },
  },
});

export const {
  changePasswordStart,
  changePasswordSuccess,
  changePasswordFailure,
  resetPasswordState,
} = passwordSlice.actions;

export default passwordSlice.reducer;