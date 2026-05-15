import { useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { setIsLogin } from "../stores/features/authSlice";
import { setMe } from "../stores/features/meSlice";
import { authService } from "../services/authService";

const LandingPage = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const isLogin = useSelector((state) => state.auth.isLogin);
  const me = useSelector((state) => state.me.item);
  const handleLogout = () => {
    authService.Logout({ dispatch, setIsLogin, setMe, navigate });
  };
  return (
    <>
      {isLogin && me && <h2>Xin chào {me.full_name}</h2>}
      {isLogin && me ? (
        <button onClick={handleLogout}>Đăng xuất</button>
      ) : (
        <button onClick={() => navigate("/login")}>Đăng nhập</button>
      )}
    </>
  );
};
export default LandingPage;
