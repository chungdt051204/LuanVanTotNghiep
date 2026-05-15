import { useSelector, useDispatch } from "react-redux";
import { authService } from "../../services/authService";
import { Link, useNavigate } from "react-router-dom";
import { setIsLogin } from "../../stores/features/authSlice";
import { setMe } from "../../stores/features/meSlice";
const InstructorDashboard = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const isLogin = useSelector((state) => state.auth.isLogin);
  const me = useSelector((state) => state.me.item);
  const handleLogout = () => {
    authService.Logout({ dispatch, setIsLogin, setMe, navigate });
  };
  return (
    <>
      <div>
        {isLogin && me && <p>Xin chào {me.full_name}</p>}
        {isLogin && me && (
          <button on onClick={handleLogout}>
            Đăng xuất
          </button>
        )}
        <ul className="flex justify-evenly underline">
          <li>
            <Link to="/instructor/dashboard">Dashboard</Link>
          </li>
          <li>
            <Link to="/instructor/courses">Khóa học</Link>
          </li>
          <li>Học viên</li>
        </ul>
      </div>
    </>
  );
};
export default InstructorDashboard;
