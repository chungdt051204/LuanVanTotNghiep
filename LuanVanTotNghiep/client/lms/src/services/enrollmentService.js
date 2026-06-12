import { axiosClient } from "./axiosClient";
export const enrollmentService = {
  createEnrollment: async ({ data }) => {
    const response = await axiosClient.post("/enrollment", {
      data,
    });
    return response;
  },
  getEnrollmentsByUser: async () => {
    const response = await axiosClient.get("/user/enrollments");
    return response;
  },
  getAllEnrollments: async () => {
    const response = await axiosClient.get("/enrollments");
    return response;
  },
};
