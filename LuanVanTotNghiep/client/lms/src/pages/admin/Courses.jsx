import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { courseService } from "../../services/courseService";
import { setCourses, updateCourse } from "../../stores/features/courseSlice";
import { RxPeople } from "react-icons/rx";
import { toast } from "react-toastify";
import { IoListOutline } from "react-icons/io5";
import { GoClock } from "react-icons/go";
import { CiCircleCheck } from "react-icons/ci";
import { LuInbox } from "react-icons/lu";

const AdminCourses = () => {
  const dispatch = useDispatch();
  const { items: courses, isLoading } = useSelector((state) => state.courses);
  const filterTabs = [
    {
      status: "",
      title: "Tất cả khóa học",
      icon: <IoListOutline />,
      numberCourse: courses?.length,
    },
    {
      status: "pending",
      title: "Đang chờ duyệt",
      icon: <GoClock />,
      numberCourse: courses?.filter(
        (value) =>
          value?.course?.is_visible && value?.course?.status == "pending"
      )?.length,
    },
    {
      status: "approved",
      title: "Đã đăng tải",
      icon: <CiCircleCheck />,
      numberCourse: courses?.filter(
        (value) =>
          value?.course?.is_visible && value?.course?.status == "approved"
      )?.length,
    },
  ];
  const [idx, setIdx] = useState(0);
  const currentStatus = filterTabs[idx].status;
  const displayCourses = courses?.filter((value) => {
    if (currentStatus == "") return value;
    else return value?.course?.status == currentStatus;
  });

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
      dispatch(updateCourse(result.data));
      toast.success(result.message || "Duyệt khóa học thành công");
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
      dispatch(updateCourse(result.data));
      toast.success(result.message || "Từ chối khóa học thành công");
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
        <div className="flex mt-6 border border-gray-300 rounded-[8px] w-[95%]">
          {filterTabs?.map((value, index) => {
            const borderBottomColors = [
              "border-b-2 border-b-blue-600",
              "border-b-2 border-b-yellow-600",
              "border-b-2 border-b-green-600",
            ];
            const textColors = [
              "text-blue-600",
              "text-yellow-600",
              "text-green-600",
            ];
            return (
              <div
                className={`flex py-4 ${
                  idx == index && borderBottomColors[index]
                }`}
                onClick={() => setIdx(index)}
                key={index}
              >
                <div
                  className={`flex gap-x-2 items-center px-6 text-title-sm font-medium ${
                    idx == index ? textColors[index] : "text-nav-muted"
                  }`}
                >
                  {value.icon}
                  <p>{value.title}</p>
                  <p>({value.numberCourse})</p>
                </div>
              </div>
            );
          })}
        </div>
        {isLoading ? (
          <p>Đang tải dữ liệu...</p>
        ) : displayCourses?.length == 0 ? (
          <div className="flex flex-col items-center gap-y-2 text-title-sm text-nav-muted w-[95%] mt-6">
            <LuInbox className="text-display-md text-gray-300" />
            <p>Chưa có khóa học nào</p>
          </div>
        ) : (
          <table className="w-[95%] border-separate border-spacing-0 overflow-hidden border-1 border-surface-bg rounded-[16px] mt-6">
            <thead>
              <tr className="flex items-center justify-between text-surface-nav font-medium">
                <td className="w-[35%] p-2">Khóa học</td>
                <td className="w-[20%]">Giảng viên</td>
                <td className="w-[15%]">Học viên</td>
                <td className="w-[10%]">Trạng thái</td>
                <td className="w-[20%] p-2 text-right">Thao tác</td>
              </tr>
            </thead>
            <tbody>
              {displayCourses.length > 0 ? (
                displayCourses.map((value) => {
                  return (
                    <tr
                      className="flex justify-between items-center border border-surface-bg hover:bg-surface-bg"
                      key={value?.course._id}
                    >
                      <td className="flex items-center gap-x-2 w-[35%] p-2">
                        <img
                          src={value?.course.image_url}
                          width={50}
                          height={50}
                        />
                        <div>
                          <p className="text-surface-nav text-title-lg font-medium">
                            {value?.course.course_name}
                          </p>
                          <p className="text-nav-muted text-body-lg">
                            {value?.course.category_id.category_name}
                          </p>
                        </div>
                      </td>
                      <td className="w-[20%]">
                        {value?.course.user_id.full_name}
                      </td>
                      <td className="flex gap-x-1 items-center w-[15%]">
                        <RxPeople />
                        <p>{value.numberEnrollment}</p>
                      </td>
                      <td className="w-[10%]">
                        <p
                          className={`text-body-md text-center font-medium rounded-[8px] ${
                            value?.course.status === "pending"
                              ? "text-yellow-700 bg-yellow-100"
                              : value?.course.status === "approved"
                              ? "text-green-700 bg-green-100"
                              : "text-red-700 bg-red-100"
                          } `}
                        >
                          {value?.course.status}
                        </p>
                      </td>

                      <td className="flex justify-end items-center w-[20%] pe-2">
                        {value?.course.status === "pending" && (
                          <div className="flex gap-x-1">
                            <button
                              onClick={() =>
                                handleApproveCourse({
                                  courseId: value?.course._id,
                                })
                              }
                              className="px-2 py-1 bg-green-700 text-body-lg text-surface-white rounded-[8px] transition-transform duration-300 hover:text-surface-bg hover:cursor-pointer"
                            >
                              Duyệt
                            </button>
                            <button
                              onClick={() =>
                                handleRejectCourse({
                                  courseId: value?.course._id,
                                  status: value?.course.status,
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
                  <td colSpan={6}>Chưa có khóa học nào</td>
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
