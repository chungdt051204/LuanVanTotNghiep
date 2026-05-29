import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { courseService } from "../../services/courseService";
import { setCourses, updateCourse } from "../../stores/features/courseSlice";
import { IoEyeOutline } from "react-icons/io5";

const AdminCourses = () => {
  const dispatch = useDispatch();
  const { items: courses, isLoading } = useSelector((state) => state.courses);

  useEffect(() => {
    const getCoursesByAdmin = async () => {
      try {
        const result = await courseService.getCoursesByAdmin();
        console.log(result);
        dispatch(setCourses(result.data));
      } catch (error) {
        const status = error.status;
        const message = error.data.message;
        console.log(status, message);
      }
    };
    getCoursesByAdmin();
  }, [dispatch]);

  const handleApproveCourse = async ({ courseId }) => {
    try {
      const result = await courseService.approveOrRejectCourse({
        courseId,
        status: "approved",
      });
      console.log(result);
      dispatch(updateCourse(result.data));
    } catch (error) {
      const status = error.status;
      const message = error.data.message;
      console.log(status, message);
    }
  };
  const handleRejectCourse = async ({ courseId }) => {
    try {
      const result = await courseService.approveOrRejectCourse({
        courseId,
        status: "rejected",
      });
      console.log(result);
      dispatch(updateCourse(result.data));
    } catch (error) {
      const status = error.status;
      const message = error.data.message;
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
              Phê duyệt khóa học của giảng viên
            </p>
          </div>
        </div>
        {isLoading ? (
          <p>Đang tải dữ liệu...</p>
        ) : (
          <table className="w-[95%] border-separate border-spacing-0 overflow-hidden border-1 border-surface-bg rounded-[16px] mt-6">
            <thead>
              <tr className="flex items-center justify-between text-surface-nav font-medium">
                <td className="w-[35%] p-2">Khóa học</td>
                <td className="w-[20%]">Giảng viên</td>
                <td className="w-[15%] text-center">Học viên</td>
                <td className="w-[10%]">Trạng thái</td>
                <td className="w-[20%] p-2 text-right">Thao tác</td>
              </tr>
            </thead>
            <tbody>
              {courses.length > 0 ? (
                courses.map((value) => {
                  return (
                    <tr
                      className="flex justify-between items-center border border-surface-bg hover:bg-surface-bg"
                      key={value._id}
                    >
                      <td className="flex items-center gap-x-2 w-[35%] p-2">
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
                      <td className="w-[20%]">{value.user_id.full_name}</td>
                      <td className="w-[15%]"></td>
                      <td className="w-[10%]">
                        <p
                          className={`text-body-md text-center font-medium rounded-[8px] ${
                            value.status === "pending"
                              ? "text-yellow-700 bg-yellow-100"
                              : value.status === "approved"
                              ? "text-green-700 bg-green-100"
                              : "text-red-700 bg-red-100"
                          } `}
                        >
                          {value.status}
                        </p>
                      </td>

                      <td className="flex justify-end items-center w-[20%] pe-2">
                        <div className="p-3 rounded-[8px] text-title-lg transition-transform duration-300 hover:bg-gray-200 hover:cursor-pointer">
                          <IoEyeOutline />
                        </div>
                        {value.status === "pending" && (
                          <div className="flex gap-x-1">
                            <button
                              onClick={() =>
                                handleApproveCourse({
                                  courseId: value._id,
                                })
                              }
                              className="px-2 py-1 bg-green-700 text-body-lg text-surface-white rounded-[8px] transition-transform duration-300 hover:text-surface-bg hover:cursor-pointer"
                            >
                              Duyệt
                            </button>
                            <button
                              onClick={() =>
                                handleRejectCourse({
                                  courseId: value._id,
                                  status: value.status,
                                })
                              }
                              className="px-2 py-1 bg-brand-primary text-body-lg text-surface-white rounded-[8px] transition-transform duration-300 hover:text-surface-bg hover:cursor-pointer"
                            >
                              Từ chối
                            </button>
                          </div>
                        )}
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
export default AdminCourses;
