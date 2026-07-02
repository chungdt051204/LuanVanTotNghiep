import { axiosClient } from "./axiosClient";

export const userService = {
  getMe: async () => {
    const result = await axiosClient.get("/me");
    console.log(result);
    return result;
  },
  getInstructors: async ({ params }) => {
    const response = await axiosClient.get(`/admin/instructors?${params}`);
    return response;
  },
  getUsers: async ({ params }) => {
    const response = await axiosClient.get(`/admin/users?${params}`);
    return response;
  },
  getInstructorById: async ({ instructorId }) => {
    const response = await axiosClient.get(`/admin/instructor/${instructorId}`);
    return response;
  },
  getUserById: async ({ userId }) => {
    const response = await axiosClient.get(`/admin/user/${userId}`);
    return response;
  },
  updateProfile: async ({ data }) => {
    const response = await axiosClient.put("/me", data, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
    return response;
  },
  updateStatusUser: async ({ userId }) => {
    const response = await axiosClient.put(`/admin/user/${userId}/status`);
    return response;
  },
  updateInstructorInfo: async ({ instructorId, formData }) => {
    const response = await axiosClient.put(
      `/admin/instructor/${instructorId}`,
      { formData }
    );
    return response;
  },
};
