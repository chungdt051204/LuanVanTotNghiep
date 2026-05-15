import { configureStore } from "@reduxjs/toolkit";
import { authSlice } from "./features/authSlice";
import { meSlice } from "./features/meSlice";
import { roleSlice } from "./features/roleSlice";
import { categorySlice } from "./features/categorySlice";
export const store = configureStore({
  reducer: {
    auth: authSlice.reducer,
    roles: roleSlice.reducer,
    me: meSlice.reducer,
    categories: categorySlice.reducer,
  },
});
