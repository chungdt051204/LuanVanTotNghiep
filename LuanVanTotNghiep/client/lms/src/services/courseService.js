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
};
