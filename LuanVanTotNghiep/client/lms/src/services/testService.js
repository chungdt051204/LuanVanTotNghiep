import { axiosClient } from "./axiosClient";
export const testService = {
  getTestsByInstructor: async () => {
    const response = await axiosClient.get("/instructor/tests");
    return response;
  },
  getTestById: async ({ testId }) => {
    const response = await axiosClient.get(`/test/${testId}`);
    return response;
  },
  createTest: async ({ formData }) => {
    const response = await axiosClient.post("/instructor/test/create", {
      formData,
    });
    return response;
  },
};
