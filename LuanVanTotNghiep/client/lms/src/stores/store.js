import { configureStore } from "@reduxjs/toolkit";
import { authSlice } from "./features/authSlice";
import { meSlice } from "./features/meSlice";
export const store = configureStore({
  reducer: {
    auth: authSlice.reducer,
    me: meSlice.reducer,
  },
});
