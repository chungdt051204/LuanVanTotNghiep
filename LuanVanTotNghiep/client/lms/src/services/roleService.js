import { axiosClient } from "./axiosClient";
export const roleService = {
  getAllRoles: async () => {
    const result = await axiosClient.get("/roles");
    console.log(result);
    return result;
  },
};
