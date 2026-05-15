import { Routes, Route, useSearchParams } from "react-router-dom";
import { useDispatch } from "react-redux";
import { ToastContainer } from "react-toastify";
import LandingPage from "./pages/LandingPage";
import Login from "./pages/Login";
import Register from "./pages/Register";
import InstructorDashboard from "./pages/instructor/Dashboard";
import { useEffect } from "react";
import { userService } from "./services/userService";
import { setIsLogin } from "./stores/features/authSlice";
import { setMe } from "./stores/features/meSlice";
import AddCourse from "./pages/instructor/AddCourse";
import InstructorCourses from "./pages/instructor/Courses";
import ProtectedRouteInstructor from "./pages/instructor/ProtectedRoute";
import { roleService } from "./services/roleService";
import { setRoles } from "./stores/features/roleSlice";
import { setCategories } from "./stores/features/categorySlice";
import { categoryService } from "./services/categoryService";
export const api = "http://localhost:3000";
function App() {
  const dispatch = useDispatch();
  const [searchParams, setSearchParams] = useSearchParams();
  const token = searchParams.get("token");
  useEffect(() => {
    const getAllRoles = async () => {
      const result = await roleService.getAllRoles();
      dispatch(setRoles(result.data));
    };
    getAllRoles();
  }, [dispatch]);
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
  useEffect(() => {
    const getAllCategories = async () => {
      const result = await categoryService.getAllCategories();
      dispatch(setCategories(result.data));
    };
    getAllCategories();
  }, [dispatch]);
  return (
    <>
      <Routes>
        <Route path="" element={<LandingPage />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route element={<ProtectedRouteInstructor />}>
          <Route
            path="instructor/dashboard"
            element={<InstructorDashboard />}
          />
          <Route path="instructor/courses" element={<InstructorCourses />} />
          <Route path="instructor/courses/add" element={<AddCourse />} />
        </Route>
      </Routes>
      <ToastContainer autoClose={1500} position="top-center" />
    </>
  );
}

export default App;
