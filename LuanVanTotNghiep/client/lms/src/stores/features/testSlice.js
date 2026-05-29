import { createSlice } from "@reduxjs/toolkit";
const initialState = {
  items: [],
  isLoading: true,
};
export const testSlice = createSlice({
  name: "tests",
  initialState,
  reducers: {
    setTests: (state, action) => {
      state.items = action.payload;
      state.isLoading = false;
    },
    deleteTest: (state, action) => {
      state.items = state.items.filter(
        (value) => value._id != action.payload._id
      );
    },
  },
});
export const { setTests, deleteTest } = testSlice.actions;
