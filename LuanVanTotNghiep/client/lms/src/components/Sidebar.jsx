import { NavLink } from "react-router-dom";
import { useSelector } from "react-redux";
import { IoBookOutline } from "react-icons/io5";
import { IoBarChartOutline } from "react-icons/io5";
import { IoDocumentTextOutline } from "react-icons/io5";
import { RxPeople } from "react-icons/rx";
import { BiComment } from "react-icons/bi";
export const Sidebar = () => {
  const me = useSelector((state) => state.me.item);
  const currenRole = me?.role_id.role || "user";
  const sideBarItem = {
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
  return (
    <>
      <div className="p-3">
        <ul className="flex flex-col justify-between h-[220px]">
          {sideBarItem[currenRole]?.map((value, index) => {
            return (
              <li key={index}>
                <NavLink
                  to={value.route}
                  className={({ isActive }) => {
                    return `flex items-center gap-x-2 px-4 py-2 rounded-[8px] text-title-lg transition-colors duration-200 ${
                      isActive
                        ? "bg-auth text-surface-white"
                        : "text-nav-muted hover:bg-surface-bg"
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
      </div>
    </>
  );
};
export default Sidebar;
