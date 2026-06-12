import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  items: [],
  isLoading: true,
};
export const notificationSlice = createSlice({
  name: "notifications",
  initialState,
  reducers: {
    setNotifications: (state, action) => {
      state.items = action.payload;
      state.isLoading = false;
    },
    createNotification: (state, action) => {
      state.items.push(action.payload);
    },
  },
});
export const { setNotifications, createNotification } =
  notificationSlice.actions;
