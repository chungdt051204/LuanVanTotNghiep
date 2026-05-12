import { Routes, Route, useSearchParams } from "react-router-dom";
import { useDispatch } from "react-redux";
import { ToastContainer } from "react-toastify";
import LandingPage from "./pages/LandingPage";
import Login from "./pages/Login";
import Register from "./pages/Register";
import { useEffect } from "react";
import { userService } from "./services/userService";
import { setIsLogin } from "./stores/features/authSlice";
import { setMe } from "./stores/features/meSlice";
export const api = "http://localhost:3000";
function App() {
  const dispatch = useDispatch();
  const [searchParams, setSearchParams] = useSearchParams();
  const token = searchParams.get("token");
  useEffect(() => {
    const getMe = async () => {
      if (token) {
        localStorage.setItem("token", token);
        setSearchParams((prev) => {
          prev.delete("token");
        });
      }
      try {
        const result = await userService.getMe();
        dispatch(setIsLogin(true));
        dispatch(setMe(result.data));
      } catch (error) {
        const status = error.status;
        const message = error.data.message;
        console.log(status, message);
      }
    };
    getMe();
  }, [dispatch, setSearchParams, token]);
  return (
    <>
      <Routes>
        <Route path="" element={<LandingPage />}></Route>
        <Route path="/login" element={<Login />}></Route>
        <Route path="/register" element={<Register />}></Route>
      </Routes>
      <ToastContainer autoClose={1500} position="top-center" />
    </>
  );
}

export default App;
