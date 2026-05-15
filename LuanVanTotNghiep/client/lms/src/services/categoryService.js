import { axiosClient } from "./axiosClient";
export const categoryService = {
  getAllCategories: async () => {
    const result = await axiosClient.get("/categories");
    console.log(result);
    return result;
  },
};
