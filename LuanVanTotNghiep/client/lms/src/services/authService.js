import { toast } from "react-toastify";
import { axiosClient } from "./axiosClient";

export const authService = {
  Register: async ({ data }) => {
    const result = await axiosClient.post("/auth/register", data);
    console.log(result);
    return result;
  },
  Login: async ({ data }) => {
    const result = await axiosClient.post("/auth/login", data);
    console.log(result);
    return result;
  },
  Logout: ({ dispatch, setIsLogin, setMe, navigate }) => {
    localStorage.removeItem("token");
    dispatch(setIsLogin(false));
    dispatch(setMe(null));
    toast.success("Đăng xuất thành công");
    setTimeout(() => {
      navigate("/");
    }, 1000);
  },
};
