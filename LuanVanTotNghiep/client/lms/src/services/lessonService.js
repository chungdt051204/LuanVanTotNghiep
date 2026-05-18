import { axiosClient } from "./axiosClient";

export const lessonService = {
  getLessonsByCourse: async ({ courseId }) => {
    const result = await axiosClient.get(`/lessons/${courseId}`);
    return result;
  },
  deleteLesson: async ({ lessonId }) => {
    const result = await axiosClient.delete(`/lesson/${lessonId}`);
    return result;
  },
};
