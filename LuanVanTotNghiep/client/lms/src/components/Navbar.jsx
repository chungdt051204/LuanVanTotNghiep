import { useNavigate, NavLink } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { authService } from "../services/authService";
import { setIsLogin } from "../stores/features/authSlice";
import { setMe } from "../stores/features/meSlice";
import { IoBookOutline } from "react-icons/io5";
import { IoBarChartOutline } from "react-icons/io5";
import { IoDocumentTextOutline } from "react-icons/io5";
import { RxPeople } from "react-icons/rx";
import { BiComment } from "react-icons/bi";
export const Navbar = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const isLogin = useSelector((state) => state.auth.isLogin);
  const me = useSelector((state) => state.me.item);
  const currentRole = me?.role_id?.role || "user";
  const navbarItem = {
    user: ["Trang chủ", "Khóa học"],
    instructor: [
      {
        item: <IoBarChartOutline />,
        title: "Dashboard",
        route: "/instructor/dashboard",
      },
      {
        item: <IoBookOutline />,
        title: "Khóa học",
        route: "/instructor/courses",
      },
      {
        item: <IoDocumentTextOutline />,
        title: "Bài kiểm tra",
        route: "/instructor/quizzes",
      },
      { item: <RxPeople />, title: "Học viên", route: "/instructor/students" },
      {
        item: <BiComment />,
        title: "Bình luận",
        route: "/instructor/comments",
      },
    ],
    admin: [
      "Dashboard",
      "Khóa học",
      "Giảng viên",
      "Học viên",
      "Bình luận & Đánh giá",
    ],
  };
  const handleLogout = () => {
    authService.Logout({ dispatch, navigate, setIsLogin, setMe });
  };
  return (
    <>
      <nav className="flex justify-evenly items-center p-3 border-b-2 border-b-surface-bg shadow-surface-bg">
        <div className="flex items-center w-[10%]">
          <IoBookOutline className="w-[50px] h-[50px] p-2 bg-auth rounded-[8px]  text-surface-white" />
          <p className="bg-auth bg-clip-text text-display-sm text-transparent ms-2">
            LMS
          </p>
        </div>
        <ul className="flex justify-between w-[55%]">
          {navbarItem[currentRole]?.map((value, index) => {
            return (
              <li key={index}>
                <NavLink
                  to={value.route}
                  className={({ isActive }) => {
                    return `flex items-center gap-x-1 text-title-lg transition-colors duration-200 ${
                      isActive
                        ? "text-brand-blue font-medium"
                        : "text-nav-muted hover:text-brand-blue"
                    }`;
                  }}
                >
                  {value.item}
                  {value.title}
                </NavLink>
              </li>
            );
          })}
        </ul>
        <div>
          {isLogin && me ? (
            <div className="flex items-center">
              <img src={me.avatar} alt="" width={50} height={50} />
              <button onClick={handleLogout}>Đăng xuất</button>
            </div>
          ) : (
            <button onClick={() => navigate("/login")}>Đăng nhập</button>
          )}
        </div>
      </nav>
    </>
  );
};
export default Navbar;
