import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  item: null,
};
export const meSlice = createSlice({
  name: "me",
  initialState,
  reducers: {
    setMe: (state, action) => {
      state.item = action.payload;
    },
  },
});
export const { setMe } = meSlice.actions;
