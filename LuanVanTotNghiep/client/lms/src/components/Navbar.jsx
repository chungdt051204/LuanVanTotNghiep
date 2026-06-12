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
import { LuUserRound } from "react-icons/lu";
import { AiOutlineHome } from "react-icons/ai";
import SearchBar from "./SearchBar";
import { IoSearch } from "react-icons/io5";
import { IoMdNotificationsOutline } from "react-icons/io";
import { IoCartOutline } from "react-icons/io5";
import { FaAngleDown } from "react-icons/fa6";
import { FaAngleUp } from "react-icons/fa6";
import { useState } from "react";
import { LuInbox } from "react-icons/lu";

export const Navbar = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const isLogin = useSelector((state) => state.auth.isLogin);
  const me = useSelector((state) => state.me.item);
  const currentRole = me?.role_id?.role || "user";
  const myCart = useSelector((state) => state.cart);
  const notifications = useSelector((state) => state.notifications.items);
  const navbarItem = {
    user: [
      {
        item: <AiOutlineHome />,
        title: "Trang chủ",
        route: "/",
      },
      {
        item: <IoBookOutline />,
        title: "Khóa học",
        route: "/courses",
      },
    ],
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
        route: "/instructor/tests",
      },
      { item: <RxPeople />, title: "Học viên", route: "/instructor/students" },
    ],
    admin: [
      {
        item: <IoBarChartOutline />,
        title: "Dashboard",
        route: "/admin/dashboard",
      },
      {
        item: <IoBookOutline />,
        title: "Khóa học",
        route: "/admin/courses",
      },
      {
        item: <LuUserRound />,
        title: "Giảng viên",
        route: "/admin/instructors",
      },
      { item: <RxPeople />, title: "Người dùng", route: "/admin/users" },
      {
        item: <BiComment />,
        title: "Bình luận",
        route: "/admin/comments",
      },
      {
        item: <LuInbox />,
        title: "Đơn hàng",
        route: "/admin/orders",
      },
    ],
  };
  const [clicked, setClicked] = useState(false);
  const handleLogout = () => {
    authService.Logout({ dispatch, navigate, setIsLogin, setMe });
  };
  return (
    <>
      <nav className="fixed flex justify-evenly items-center w-full bg-surface-white py-3 px-16 shadow-lg z-1000">
        <div className="flex items-center w-[10%]">
          <IoBookOutline className="w-[50px] h-[50px] p-2 bg-auth rounded-[8px]  text-surface-white" />
          <p className="bg-auth bg-clip-text text-display-sm text-transparent ms-2">
            LMS
          </p>
        </div>
        {currentRole === "user" && (
          <div className="flex gap-x-2 items-center w-[32%] py-2 px-4 bg-surface-bg rounded-[8px]">
            <IoSearch className="text-headline-sm text-nav-muted font-medium" />
            <SearchBar />
          </div>
        )}
        <ul className="flex gap-x-8">
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
        {isLogin && currentRole == "user" && (
          <div className="flex gap-x-6 items-center">
            <div className="relative">
              <IoCartOutline
                className="text-headline-md text-surface-nav"
                onClick={() => navigate("/cart")}
              />
              {myCart?.items?.length > 0 && (
                <div className="absolute bottom-4 left-4 bg-brand-blue w-[22px] h-[22px] rounded-[1000px]">
                  <p className="text-title-sm text-surface-white font-medium text-center">
                    {myCart?.items?.length}
                  </p>
                </div>
              )}
            </div>
            <div className="relative">
              <IoMdNotificationsOutline
                className="text-headline-md"
                onClick={() => navigate("/notifications")}
              />
              {notifications?.filter((value) => !value.is_read)?.length > 0 && (
                <div className="absolute bottom-4 left-4 bg-red-500 w-[22px] h-[22px] rounded-[1000px]">
                  <p className="text-title-sm text-surface-white font-medium text-center">
                    {notifications?.filter((value) => !value.is_read)?.length}
                  </p>
                </div>
              )}
            </div>
          </div>
        )}
        <div>
          {isLogin && me ? (
            <div
              onClick={() => setClicked((prev) => !prev)}
              className="relative flex gap-x-3 items-center text-title-lg text-surface-nav"
            >
              <img
                className="w-[40px] h-[40px] rounded-[1000px] object-cover"
                src={me.avatar}
                alt=""
                referrerPolicy="no-referrer"
              />
              {clicked ? <FaAngleUp /> : <FaAngleDown />}
              {clicked && (
                <div className="absolute flex flex-col gap-y-2 top-16 p-4 w-[160px] bg-surface-white rounded-[6px] shadow-md text-title-sm text-nav-muted">
                  <p className="transition-transform duration-300 hover:cursor-pointer hover:text-brand-blue hover:underline">
                    Tài khoản của tôi
                  </p>
                  {currentRole == "user" && (
                    <p
                      onClick={() => navigate("/my-courses")}
                      className="transition-transform duration-300 hover:cursor-pointer hover:text-brand-blue hover:underline"
                    >
                      Khóa học của tôi
                    </p>
                  )}
                  <button
                    onClick={handleLogout}
                    className="px-2 py-1 bg-surface-nav rounded-[8px] text-surface-white transition-transform duration-300 hover:cursor-pointer hover:text-surface-bg hover:scale-105"
                  >
                    Đăng xuất
                  </button>
                </div>
              )}
            </div>
          ) : (
            <button
              className="px-2 py-2 bg-surface-nav rounded-[8px] text-surface-white transition-transform duration-300 hover:cursor-pointer hover:text-surface-bg hover:scale-105"
              onClick={() => navigate("/login")}
            >
              Đăng nhập
            </button>
          )}
        </div>
      </nav>
    </>
  );
};
export default Navbar;
