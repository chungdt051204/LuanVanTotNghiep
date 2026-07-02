import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, useSearchParams } from "react-router-dom";
import { courseService } from "../../services/courseService";
import { setCourses, updateCourse } from "../../stores/features/courseSlice";
import { toast } from "react-toastify";
import { FaPlus } from "react-icons/fa6";
import { LuSquarePen } from "react-icons/lu";
import { RiDeleteBinLine } from "react-icons/ri";
import { FaTrashRestore } from "react-icons/fa";
import { RxPeople } from "react-icons/rx";
import { IoListOutline } from "react-icons/io5";
import { RiDraftLine } from "react-icons/ri";
import { GoClock } from "react-icons/go";
import { CiCircleCheck } from "react-icons/ci";
import { LuInbox } from "react-icons/lu";
import { format } from "../../../helper/format";
import PaginationButton from "../../components/PaginationButton";
import { FaStar } from "react-icons/fa";

const InstructorCourses = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const dispatch = useDispatch();
  const { items: myCourses, isLoading } = useSelector((state) => state.courses);
  const filterTabs = [
    {
      status: "",
      title: "Tất cả khóa học",
      icon: <IoListOutline />,
    },
    {
      status: "draft",
      title: "Bản nháp",
      icon: <RiDraftLine />,
    },
    {
      status: "pending",
      title: "Đang chờ duyệt",
      icon: <GoClock />,
    },
    {
      status: "approved",
      title: "Đã đăng tải",
      icon: <CiCircleCheck />,
    },
    {
      status: "deleted",
      title: "Đã xóa",
      icon: <RiDeleteBinLine />,
    },
  ];
  const [status, setStatus] = useState("");
  const [idx, setIdx] = useState(0);

  useEffect(() => {
    const getCoursesByInstructor = async () => {
      try {
        const params = new URLSearchParams(searchParams);
        params.append("limit", 5);
        if (status) params.append("status", status);
        const result = await courseService.getCoursesByInstructor({
          params: params.toString(),
        });
        console.log(result);
        dispatch(setCourses(result.data));
      } catch (error) {
        const status = error.status;
        const message = error.data.message;
        console.log(status, message);
      }
    };
    getCoursesByInstructor();
  }, [dispatch, searchParams, status]);
  const handleDeleteOrRestoreCourse = async ({ courseId, isVisible }) => {
    try {
      const action = isVisible ? "delete" : "restore";
      const result = await courseService.deleteOrRestoreCourse({
        courseId,
        action,
      });
      console.log(result);
      toast.success(result.message);
      dispatch(updateCourse(result.data));
    } catch (error) {
      const status = error.status;
      const message = error.message;
      console.log(status, message);
    }
  };
  const handleSubmitOrUnSubmitCourse = async ({ courseId, status }) => {
    const item = myCourses?.find((value) => value?.course?._id == courseId);
    console.log(item?.course?.status);
    if (item?.course?.status == "draft") {
      if (item?.numberLesson == 0 || item?.numberTest == 0) {
        toast.error(
          "Khóa học này chưa có bài học hoặc bài kiểm tra, không thể đăng tải!"
        );
        return;
      }
    }
    const statusCourse =
      status === "draft" || status === "rejected" ? "pending" : "draft";
    try {
      const result = await courseService.submitOrUnSubmitCourse({
        courseId,
        status: statusCourse,
      });
      console.log(result);
      dispatch(updateCourse(result.data));
      toast.success(
        result.message || "Đăng tải/Hủy đăng tải khóa học thành công"
      );
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
        <div className="flex mt-6 border border-gray-300 rounded-[8px] w-[95%]">
          {filterTabs?.map((value, index) => {
            const borderBottomColors = [
              "border-b-2 border-b-blue-600",
              "border-b-2 border-b-gray-600",
              "border-b-2 border-b-yellow-600",
              "border-b-2 border-b-green-600",
              "border-b-2 border-b-red-600",
            ];
            const textColors = [
              "text-blue-600",
              "text-gray-600",
              "text-yellow-600",
              "text-green-600",
              "text-red-600",
            ];
            return (
              <div
                className={`flex py-4 ${
                  idx == index && borderBottomColors[index]
                }`}
                onClick={() => {
                  setIdx(index);
                  setStatus(value.status);
                }}
                key={index}
              >
                <div
                  className={`flex gap-x-2 items-center px-6 text-title-sm font-medium ${
                    idx == index ? textColors[index] : "text-nav-muted"
                  }`}
                >
                  {value.icon}
                  <p>{value.title}</p>
                </div>
              </div>
            );
          })}
        </div>
        <div className="flex flex-col gap-y-6">
          {isLoading ? (
            <p className="text-title-lg text-surface-nav text-center">
              Đang tải dữ liệu...
            </p>
          ) : myCourses?.arrayCourse?.length == 0 ? (
            <div className="flex flex-col items-center gap-y-2 text-title-sm text-nav-muted w-[95%] mt-6">
              <LuInbox className="text-display-md text-gray-300" />
              <p>Chưa có khóa học nào</p>
            </div>
          ) : (
            <table className="w-[95%] border-separate border-spacing-0 overflow-hidden border-1 border-gray-300 rounded-[16px] mt-6">
              <thead>
                <tr className="flex items-center justify-between text-surface-nav font-medium border-b border-gray-200">
                  <td className="w-[35%] p-2">Khóa học</td>
                  <td className="w-[10%]">Trạng thái</td>
                  <td className="w-[10%]">Học viên</td>
                  <td className="w-[10%]">Doanh thu</td>
                  <td className="w-[10%]">Đánh giá</td>
                  <td className="w-[22%] p-2 text-right">Thao tác</td>
                </tr>
              </thead>
              <tbody>
                {myCourses?.arrayCourse?.length > 0 &&
                  myCourses?.arrayCourse?.map((value) => {
                    return (
                      <tr
                        className="flex justify-between items-center border-b border-gray-200 hover:bg-surface-bg"
                        key={value.course?._id}
                      >
                        <td className="flex items-center gap-x-2 w-[35%] p-2">
                          <img
                            className="w-[50px] h-[50px] object-fill"
                            src={value.course?.image_url}
                          />
                          <div>
                            <p className="text-surface-nav text-title-lg font-medium">
                              {value.course?.course_name}
                            </p>
                            <p className="text-nav-muted text-body-lg">
                              {value.course?.category_id.category_name}
                            </p>
                          </div>
                        </td>
                        <td className="w-[10%]">
                          <p
                            className={`text-body-md text-center font-medium rounded-[8px] ${
                              value.course?.status === "draft"
                                ? "text-surface-nav bg-gray-200"
                                : value.course?.status === "pending"
                                ? "text-yellow-700 bg-yellow-100"
                                : value.course?.status === "approved"
                                ? "text-green-700 bg-green-100"
                                : "text-red-700 bg-red-100"
                            } `}
                          >
                            {value.course?.status}
                          </p>
                        </td>
                        <td className="flex gap-x-1 items-center ms-8 text-title-sm text-surface-nav w-[10%]">
                          <RxPeople />
                          <p>{value.numberEnrollment}</p>
                        </td>
                        <td className="text-title-sm text-surface-nav font-medium w-[10%]">
                          {value.revenue > 0
                            ? format.formatPrice({ price: value.revenue })
                            : 0}
                          đ
                        </td>
                        <td className="w-[10%] flex gap-x-1 items-center">
                          <FaStar className="text-title-sm text-yellow-300" />
                          {value?.course?.rating_star > 0
                            ? value?.course?.rating_star
                            : "0.0"}
                        </td>
                        <td className="flex justify-end gap-x-2 items-center pe-2 w-[22%]">
                          <div className="flex gap-x-1">
                            {(value.course?.status === "draft" ||
                              value.course?.status === "rejected") && (
                              <div className="flex gap-x-2">
                                {value.course?.is_visible && (
                                  <div className="p-3 rounded-[8px] text-title-lg hover:bg-gray-200 transition-transform duration-300 hover:cursor-pointer">
                                    <LuSquarePen
                                      onClick={() =>
                                        navigate(
                                          `/instructor/course/${value.course?._id}/edit`
                                        )
                                      }
                                    />
                                  </div>
                                )}
                                <div className="p-3 rounded-[8px] text-title-lg hover:bg-gray-200 transition-transform duration-300 hover:cursor-pointer">
                                  {value.course?.is_visible ? (
                                    <RiDeleteBinLine
                                      className="text-brand-primary"
                                      onClick={() =>
                                        handleDeleteOrRestoreCourse({
                                          courseId: value.course?._id,
                                          isVisible: value.course?.is_visible,
                                        })
                                      }
                                    />
                                  ) : (
                                    <FaTrashRestore
                                      className="text-brand-primary"
                                      onClick={() =>
                                        handleDeleteOrRestoreCourse({
                                          courseId: value.course?._id,
                                          isVisible: value.course?.is_visible,
                                        })
                                      }
                                    />
                                  )}
                                </div>
                              </div>
                            )}
                          </div>
                          {value.course?.status !== "approved" &&
                            value.course?.is_visible && (
                              <button
                                onClick={() =>
                                  handleSubmitOrUnSubmitCourse({
                                    courseId: value?.course?._id,
                                    status: value?.course?.status,
                                  })
                                }
                                className={`px-2 py-1 ${
                                  value.course?.status === "pending"
                                    ? "bg-brand-primary"
                                    : "bg-green-700"
                                }  text-body-lg text-surface-white rounded-[8px] transition-transform duration-300 hover:text-surface-bg hover:cursor-pointer`}
                              >
                                {value.course?.status === "pending"
                                  ? "Hủy đăng tải"
                                  : value.course?.status === "draft"
                                  ? "Đăng tải"
                                  : "Đăng tải lại"}
                              </button>
                            )}
                        </td>
                      </tr>
                    );
                  })}
              </tbody>
            </table>
          )}
          {myCourses?.totalPages > 1 && (
            <PaginationButton totalPages={myCourses?.totalPages} />
          )}
        </div>
      </div>
    </>
  );
};
export default InstructorCourses;
