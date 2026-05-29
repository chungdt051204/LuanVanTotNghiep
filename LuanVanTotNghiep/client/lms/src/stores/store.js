import { configureStore } from "@reduxjs/toolkit";
import { authSlice } from "./features/authSlice";
import { meSlice } from "./features/meSlice";
import { roleSlice } from "./features/roleSlice";
import { categorySlice } from "./features/categorySlice";
import { courseSlice } from "./features/courseSlice";
import { lessonSlice } from "./features/lessonSlice";
import { enrollmentSlice } from "./features/enrollmentSlice";
import { testSlice } from "./features/testSlice";
export const store = configureStore({
  reducer: {
    auth: authSlice.reducer,
    roles: roleSlice.reducer,
    me: meSlice.reducer,
    categories: categorySlice.reducer,
    courses: courseSlice.reducer,
    lessons: lessonSlice.reducer,
    enrollments: enrollmentSlice.reducer,
    tests: testSlice.reducer,
  },
});
