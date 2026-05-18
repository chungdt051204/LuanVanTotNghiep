import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { courseService } from "../../services/courseService";
import { toast } from "react-toastify";
import { FaPlus } from "react-icons/fa6";
import { IoEyeOutline } from "react-icons/io5";
import { LuSquarePen } from "react-icons/lu";
import { RiDeleteBinLine } from "react-icons/ri";

const InstructorCourses = () => {
  const navigate = useNavigate();
  const [myCourses, setMyCourses] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  useEffect(() => {
    const getCoursesByInstructor = async () => {
      try {
        const result = await courseService.getCoursesByInstructor();
        setMyCourses(result.data);
      } catch (error) {
        const status = error.status;
        const message = error.data.message;
        console.log(status, message);
      } finally {
        setIsLoading(false);
      }
    };
    getCoursesByInstructor();
  }, []);
  const handleDeleteCourse = async ({ courseId }) => {
    try {
      const result = await courseService.deleteCourse({ courseId });
      toast.success(result.message || "Xóa thành công");
    } catch (error) {
      const status = error.status;
      const message = error.message;
      console.log(status, message);
    }
  };
  return (
    <>
      <div className="w-[100%] py-8">
        <div className="flex justify-between items-center w-[95%]">
          <div className="h-[70px] flex flex-col justify-between">
            <p className="text-display-sm text-surface-nav font-bold">
              Quản lý khóa học
            </p>
            <p className="text-title-lg text-nav-muted">
              Tạo và quản lý các khóa học của bạn
            </p>
          </div>
          <button
            onClick={() => navigate("/instructor/course/add")}
            className="flex items-center gap-x-2 px-4 py-2 rounded-[8px] bg-surface-nav text-body-lg text-surface-white transition-transform duration-300 hover:text-surface-bg hover:cursor-pointer"
          >
            <FaPlus />
            Tạo khóa học mới
          </button>
        </div>
        {isLoading ? (
          <p>Đang tải dữ liệu...</p>
        ) : (
          <table className="w-[95%] border-separate border-spacing-0 overflow-hidden border-1 border-surface-bg rounded-[16px] mt-6">
            <thead>
              <tr className="flex items-center justify-between text-surface-nav font-medium">
                <td className="w-[33%] p-2">Khóa học</td>
                <td className="w-[10%]">Trạng thái</td>
                <td className="w-[10%] text-center">Học viên</td>
                <td className="w-[15%] text-center">Doanh thu</td>
                <td className="w-[10%]">Đánh giá</td>
                <td className="w-[24%] p-2 text-right">Thao tác</td>
              </tr>
            </thead>
            <tbody>
              {myCourses.length > 0 ? (
                myCourses.map((value) => {
                  return (
                    <tr
                      className="flex justify-between items-center border border-surface-bg hover:bg-surface-bg"
                      key={value._id}
                    >
                      <td className="flex items-center gap-x-2 w-[32%] p-2">
                        <img src={value.image_url} width={50} height={50} />
                        <div>
                          <p className="text-surface-nav text-title-lg font-medium">
                            {value.course_name}
                          </p>
                          <p className="text-nav-muted text-body-lg">
                            {value.category_id.category_name}
                          </p>
                        </div>
                      </td>
                      <td className="w-[10%]">
                        <p
                          className={`text-body-md text-center font-medium rounded-[8px] ${
                            value.status === "Bản nháp"
                              ? "text-surface-nav bg-gray-200"
                              : value.status === "Chờ duyệt"
                              ? "text-yellow-700 bg-yellow-100"
                              : value.status === "Đã đăng tải"
                              ? "text-green-700 bg-green-100"
                              : "text-red-700 bg-red-100"
                          } `}
                        >
                          {value.status}
                        </p>
                      </td>
                      <td className="w-[10%]"></td>
                      <td className="w-[15%]"></td>
                      <td className="w-[10%]"></td>
                      <td className="flex justify-between items-center w-[24%] pe-2">
                        <div className="flex justify-between w-[130px]">
                          <div className="p-3 rounded-[8px] text-title-lg transition-transform duration-300 hover:bg-gray-200 hover:cursor-pointer">
                            <IoEyeOutline />
                          </div>
                          {value.status === "Bản nháp" && (
                            <div className="flex gap-x-2">
                              <div className="p-3 rounded-[8px] text-title-lg hover:bg-gray-200 transition-transform duration-300 hover:cursor-pointer">
                                <LuSquarePen
                                  onClick={() =>
                                    navigate(
                                      `/instructor/course/${value._id}/edit`
                                    )
                                  }
                                />
                              </div>
                              <div className="p-3 rounded-[8px] text-title-lg hover:bg-gray-200 transition-transform duration-300 hover:cursor-pointer">
                                <RiDeleteBinLine
                                  className="text-brand-primary"
                                  onClick={() =>
                                    handleDeleteCourse({ courseId: value._id })
                                  }
                                />
                              </div>
                            </div>
                          )}
                        </div>
                        <button className="px-2 py-1 bg-green-700 text-body-lg text-surface-white rounded-[8px] transition-transform duration-300 hover:text-surface-bg hover:cursor-pointer">
                          Đăng tải
                        </button>
                      </td>
                    </tr>
                  );
                })
              ) : (
                <tr>
                  <td colSpan={6}>Bạn chưa tạo khóa học nào</td>
                </tr>
              )}
            </tbody>
          </table>
        )}
      </div>
    </>
  );
};
export default InstructorCourses;
