import { axiosClient } from "./axiosClient";
export const orderService = {
  checkout: async ({ formData }) => {
    const response = await axiosClient.post("/checkout", { formData });
    return response;
  },
};
