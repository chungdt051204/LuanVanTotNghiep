import { axiosClient } from "./axiosClient";
export const courseService = {
  addCourse: async ({ data }) => {
    const result = await axiosClient.post("/course", data, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
    console.log(result);
    return result;
  },
  getCoursesByInstructor: async () => {
    const result = await axiosClient.get("/instructor/courses");
    return result;
  },
  getCourseById: async ({ courseId }) => {
    const result = await axiosClient.get(`/course/${courseId}`);
    return result;
  },
  updateCourse: async ({ courseId, data }) => {
    const result = await axiosClient.put(`/course/${courseId}`, data, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
    return result;
  },
  deleteCourse: async ({ courseId }) => {
    const result = await axiosClient.delete(`/course/${courseId}`);
    return result;
  },
};
