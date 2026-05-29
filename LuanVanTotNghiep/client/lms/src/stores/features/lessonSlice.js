import { createSlice } from "@reduxjs/toolkit";
const initialState = {
  items: [],
  isLoading: true,
};
export const lessonSlice = createSlice({
  name: "lessons",
  initialState,
  reducers: {
    setLessons: (state, action) => {
      state.items = action.payload;
      state.isLoading = false;
    },
    deleteLessons: (state, action) => {
      state.items = state.items.filter(
        (value) => value._id != action.payload._id
      );
    },
  },
});
export const { setLessons, deleteLessons } = lessonSlice.actions;
