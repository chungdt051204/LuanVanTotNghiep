import { createSlice } from "@reduxjs/toolkit";
const initialState = {
  items: [],
  isLoading: true,
};
export const courseSlice = createSlice({
  name: "courses",
  initialState,
  reducers: {
    setCourses: (state, action) => {
      state.items = action.payload;
      state.isLoading = false;
    },
    updateCourse: (state, action) => {
      const index = state.items.findIndex(
        (value) => value._id == action.payload._id
      );
      state.items[index] = action.payload;
    },
    deleteCourse: (state, action) => {
      state.items = state.items.filter(
        (value) => value._id != action.payload._id
      );
    },
  },
});
export const { setCourses, updateCourse, deleteCourse } = courseSlice.actions;
