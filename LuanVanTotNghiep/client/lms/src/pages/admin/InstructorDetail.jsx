import { useEffect, useState } from "react";
import { userService } from "../../services/userService";
import { useNavigate, useParams } from "react-router-dom";
import { IoListOutline } from "react-icons/io5";
import { RiDraftLine } from "react-icons/ri";
import { GoClock } from "react-icons/go";
import { CiCircleCheck } from "react-icons/ci";
import { RiDeleteBinLine } from "react-icons/ri";
import { format } from "../../../helper/format";
import { toast } from "react-toastify";
import { FaRegCalendarAlt } from "react-icons/fa";
import { GoShieldCheck } from "react-icons/go";
import { GoShieldX } from "react-icons/go";
import { IoBookOutline } from "react-icons/io5";
import { RxPeople } from "react-icons/rx";
import { BsCreditCard } from "react-icons/bs";
import { validateForm } from "../../../helper/validateForm";

const InstructorDetail = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const [isLoading, setIsLoading] = useState(true);
  const [instructor, setInstructor] = useState(null);
  const [instructorInfo, setInstructorInfo] = useState({
    fullName: "",
    email: "",
    phone: "",
    avatar: "",
    level: "",
    experience: "",
  });
  const courses = instructor?.arrayCourse;
  const levels = ["Cử nhân", "Thạc sĩ", "Tiến sĩ"];
  const [error, setError] = useState({ errorLevel: "", errorExperience: "" });
  const filterTabs = [
    {
      status: "",
      title: "Tất cả khóa học",
      icon: <IoListOutline />,
      numberCourse: courses?.filter((value) => value?.item?.is_visible)?.length,
    },
    {
      status: "draft",
      title: "Bản nháp",
      icon: <RiDraftLine />,
      numberCourse: courses?.filter(
        (value) => value?.item?.is_visible && value?.item?.status == "draft"
      )?.length,
    },
    {
      status: "pending",
      title: "Đang chờ duyệt",
      icon: <GoClock />,
      numberCourse: courses?.filter(
        (value) => value?.item?.is_visible && value?.item?.status == "pending"
      )?.length,
    },
    {
      status: "approved",
      title: "Đã đăng tải",
      icon: <CiCircleCheck />,
      numberCourse: courses?.filter(
        (value) => value?.item?.is_visible && value?.item?.status == "approved"
      )?.length,
    },
    {
      status: "deleted",
      title: "Đã xóa",
      icon: <RiDeleteBinLine />,
      numberCourse: courses?.filter((value) => !value?.item?.is_visible)
        ?.length,
    },
  ];
  const [idx, setIdx] = useState(0);
  const currentStatus = filterTabs[idx].status;
  const displayCourses = courses?.filter((value) => {
    if (currentStatus == "") return value?.item?.is_visible;
    else if (currentStatus == "deleted") return !value?.item?.is_visible;
    else return value?.item?.is_visible && value?.item?.status == currentStatus;
  });

  useEffect(() => {
    const getInstructorById = async () => {
      try {
        const result = await userService.getInstructorById({
          instructorId: id,
        });
        console.log(result.data);
        setInstructor(result.data);
        setInstructorInfo((prev) => ({
          ...prev,
          fullName: result.data?.item?.full_name || "",
          email: result.data?.item?.email || "",
          phone: result.data?.item?.phone || "",
          avatar: result.data?.item?.avatar || "",
          level: result.data?.item?.level || "",
          experience: result.data?.item?.experience || "",
        }));
      } catch (error) {
        const status = error.status;
        const message = error.data.message;
        console.log(status, message);
      } finally {
        setIsLoading(false);
      }
    };
    getInstructorById();
  }, [id]);
  const handleSubmit = async (e) => {
    e.preventDefault();
    const formData = {
      level: instructorInfo.level,
      experience: instructorInfo.experience,
    };
    if (
      !validateForm.validateUserForm({
        formData,
        setError,
      })
    ) {
      return;
    }
    try {
      const result = await userService.updateInstructorInfo({
        instructorId: id,
        formData,
      });
      toast.success(
        result.message || "Cập nhật thông tin giảng viên thành công"
      );
      navigate("/admin/instructors");
    } catch (error) {
      const status = error.status;
      const message = error.data.message;
      console.log(status, message);
    }
  };
  return (
    <>
      <div className="py-8">
        <div className="flex flex-col gap-y-2 justify-between">
          <p className="text-display-sm text-surface-nav font-bold">
            Chi tiết giảng viên
          </p>
          <p className="text-title-lg text-nav-muted">
            Quản lý thông tin giảng viên
          </p>
        </div>
        <div className="flex justify-between w-[95%] mt-6">
          <div className="flex flex-col gap-y-4 w-[34%] border border-gray-300 rounded-[16px] p-5">
            <div className="flex flex-col gap-y-1 text-center">
              <img
                className="w-[180px] h-[180px] rounded-[1000px] object-cover mx-auto"
                src={instructorInfo.avatar}
              />
              <p className="text-title-lg text-surface-nav font-medium">
                {instructorInfo.fullName}
              </p>
              <p className="text-title-sm text-nav-muted">
                {instructorInfo.email}
              </p>
            </div>
            <div className="flex gap-x-4 items-center p-2 border border-gray-300 rounded-[8px] text-nav-muted">
              <FaRegCalendarAlt className="text-title-lg" />
              <div className="flex flex-col gap-y-2 text-title-sm">
                <p>Ngày tham gia hệ thống</p>
                <p>
                  {format.formatDate({ date: instructor?.item?.createdAt })}
                </p>
              </div>
            </div>
            <div className="flex gap-x-4 items-center p-2 border border-gray-300 rounded-[8px] text-nav-muted">
              {instructor?.item?.status ? (
                <GoShieldCheck className="text-title-lg" />
              ) : (
                <GoShieldX className="text-title-lg" />
              )}
              <div className="flex flex-col gap-y-2 text-title-sm">
                <p>Trạng thái tài khoản</p>
                <p
                  className={`px-2 rounded-[8px] text-center text-body-md font-medium ${
                    instructor?.item?.status
                      ? "bg-green-50 text-green-500"
                      : "bg-red-50 text-red-500"
                  }`}
                >
                  {instructor?.item?.status
                    ? "Đang hoạt động"
                    : "Ngừng hoạt động"}
                </p>
              </div>
            </div>
          </div>
          <form
            onSubmit={handleSubmit}
            className="flex flex-col gap-y-4 w-[64%] border border-gray-300 rounded-[16px] p-5"
          >
            <p className="text-title-lg text-surface-nav font-medium">
              Thông tin cá nhân
            </p>
            <div className="flex flex-wrap gap-y-2 justify-between">
              <div className="flex flex-col gap-y-1 w-[40%]">
                <label
                  className="text-title-sm text-surface-nav font-medium"
                  htmlFor="fullName"
                >
                  Họ và tên
                </label>
                <input
                  className="px-2 py-1 border border-gray-300 rounded-[8px]"
                  type="text"
                  value={instructorInfo.fullName}
                  readOnly
                />
              </div>
              <div className="flex flex-col gap-y-1 w-[40%]">
                <label
                  className="text-title-sm text-surface-nav font-medium"
                  htmlFor="email"
                >
                  Email
                </label>
                <input
                  className="px-2 py-1 border border-gray-300 rounded-[8px]"
                  type="text"
                  value={instructorInfo.email}
                  readOnly
                />
              </div>
              <div className="flex flex-col gap-y-1 w-[40%]">
                <label
                  className="text-title-sm text-surface-nav font-medium"
                  htmlFor="phone"
                >
                  Số điện thoại
                </label>
                <input
                  className="px-2 py-1 border border-gray-300 rounded-[8px]"
                  type="text"
                  value={instructorInfo.phone}
                  readOnly
                />
              </div>
            </div>
            <hr />
            <p className="text-title-lg text-surface-nav font-medium">
              Thông tin giảng viên
            </p>
            <div className="flex flex-col gap-y-2">
              <div className="flex justify-between">
                <div className="flex flex-col gap-y-1 w-[30%]">
                  <label
                    className="text-title-sm text-surface-nav font-medium"
                    htmlFor="level"
                  >
                    Trình độ
                  </label>
                  <select
                    className="border border-gray-300 rounded-[8px] px-2 py-1 text-title-sm text-nav-muted"
                    onChange={(e) => {
                      setInstructorInfo((prev) => ({
                        ...prev,
                        level: e.target.value,
                      }));
                      setError((prev) => ({ ...prev, errorLevel: "" }));
                    }}
                    value={instructorInfo.level}
                  >
                    <option value="">Chọn trình độ</option>
                    {levels?.map((value, index) => {
                      return (
                        <option key={index} value={value}>
                          {value}
                        </option>
                      );
                    })}
                  </select>
                  <span className="text-body-md text-red-500 font-medium">
                    {error.errorLevel}
                  </span>
                </div>
                <div className="flex flex-col gap-y-1 w-[65%]">
                  <label
                    className="text-title-sm text-surface-nav font-medium"
                    htmlFor="experience"
                  >
                    Kinh nghiệm giảng dạy (năm)
                  </label>
                  <input
                    className="px-2 py-1 border border-gray-300 rounded-[8px]"
                    type="text"
                    onChange={(e) => {
                      setInstructorInfo((prev) => ({
                        ...prev,
                        experience: e.target.value,
                      }));
                      setError((prev) => ({ ...prev, errorExperience: "" }));
                    }}
                    value={instructorInfo.experience}
                    placeholder="Nhập số năm"
                  />
                  <span className="text-body-md text-red-500 font-medium">
                    {error.errorExperience}
                  </span>
                </div>
              </div>
            </div>
            <input
              className="px-2 py-1 rounded-[8px] bg-surface-nav text-title-lg text-surface-white transition-transform duration-300 hover:text-surface-bg hover:cursor-pointer"
              type="submit"
              value="Lưu thay đổi"
            />
          </form>
        </div>
        <div className="flex justify-between w-[95%] mt-10">
          <div className="flex gap-x-4 items-center border border-gray-300 rounded-[16px] p-5 w-[32%]">
            <div className="bg-blue-50 rounded-[8px] p-2">
              <IoBookOutline className="text-headline-md text-blue-600" />
            </div>
            <div className="flex flex-col gap-y-1">
              <p className="text-title-sm text-surface-nav font-medium">
                Tổng số khóa học đã tạo
              </p>
              <p className="text-headline-sm text-surface-nav font-bold">
                {instructor?.numberCourse}
              </p>
              <p className="text-title-sm text-nav-muted">Khóa học</p>
            </div>
          </div>
          <div className="flex gap-x-4 items-center border border-gray-300 rounded-[16px] p-5 w-[32%]">
            <div className="bg-green-50 rounded-[8px] p-2">
              <RxPeople className="text-headline-md text-green-600" />
            </div>
            <div className="flex flex-col gap-y-1">
              <p className="text-title-sm text-surface-nav font-medium">
                Tổng lượt đăng ký học
              </p>
              <p className="text-headline-sm text-surface-nav font-bold">
                {instructor?.numberEnrollment}
              </p>
              <p className="text-title-sm text-nav-muted">Lượt đăng ký</p>
            </div>
          </div>
          <div className="flex gap-x-4 items-center border border-gray-300 rounded-[16px] p-5 w-[32%]">
            <div className="bg-orange-50 rounded-[8px] p-2">
              <BsCreditCard className="text-headline-md text-orange-500" />
            </div>
            <div className="flex flex-col gap-y-1">
              <p className="text-title-sm text-surface-nav font-medium">
                Tổng doanh thu kiếm được
              </p>
              <p className="text-headline-sm text-surface-nav font-bold">
                {format.formatPrice({ price: instructor?.totalRevenue })}đ
              </p>
              <p className="text-title-sm text-nav-muted">Doanh thu</p>
            </div>
          </div>
        </div>
        <p className="text-title-lg text-surface-nav font-medium mt-10">
          Danh sách khóa học đã tạo
        </p>
        <div className="flex mt-6 border border-gray-300 rounded-[8px] w-[95%] mt-6">
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
          <p className="text-title-lg text-surface-nav text-center">
            Đang tải dữ liệu...
          </p>
        ) : displayCourses?.length == 0 ? (
          <div className="flex flex-col items-center gap-y-2 text-title-sm text-nav-muted w-[95%] mt-6">
            <LuInbox className="text-display-md text-gray-300" />
            <p>Chưa có khóa học nào</p>
          </div>
        ) : (
          <table className="w-[95%] border-separate border-spacing-0 overflow-hidden border-1 border-gray-300 rounded-[16px] mt-6">
            <thead>
              <tr className="flex items-center justify-between text-surface-nav font-medium border-b border-gray-200">
                <td className="w-[30%] p-2">Khóa học</td>
                <td className="w-[15%]">Danh mục</td>
                <td className="w-[10%]">Học viên</td>
                <td className="w-[10%]">Doanh thu</td>
                <td className="w-[10%]">Giá</td>
                <td className="w-[15%] p-2 text-center">Trạng thái</td>
              </tr>
            </thead>
            <tbody>
              {displayCourses.length > 0 &&
                displayCourses.map((value) => {
                  return (
                    <tr
                      className="flex justify-between items-center border-b border-gray-200 hover:bg-surface-bg"
                      key={value?.item?._id}
                    >
                      <td className="flex items-center gap-x-2 w-[30%] p-2">
                        <img
                          className="w-[50px] h-[50px] object-fill"
                          src={value?.item?.image_url}
                        />
                        <div>
                          <p className="text-surface-nav text-title-sm font-medium">
                            {value?.item?.course_name}
                          </p>
                        </div>
                      </td>
                      <td className="w-[15%]">
                        {value?.item?.category_id?.category_name}
                      </td>
                      <td className="text-title-sm text-surface-nav w-[10%]">
                        <p>{value.numberStudent}</p>
                      </td>
                      <td className="text-title-sm text-surface-nav w-[10%]">
                        {format.formatPrice({ price: value.revenue })}đ
                      </td>
                      <td className="w-[10%]">
                        {format.formatPrice({ price: value?.item?.price })}đ
                      </td>
                      <td className="p-2 w-[15%]">
                        <p
                          className={`text-body-md text-center font-medium rounded-[8px] ${
                            value?.item?.status === "draft"
                              ? "text-surface-nav bg-gray-200"
                              : value?.item?.status === "pending"
                              ? "text-yellow-700 bg-yellow-100"
                              : value?.item?.status === "approved"
                              ? "text-green-700 bg-green-100"
                              : "text-red-700 bg-red-100"
                          } `}
                        >
                          {value?.item?.status}
                        </p>
                      </td>
                    </tr>
                  );
                })}
            </tbody>
          </table>
        )}
      </div>
    </>
  );
};
export default InstructorDetail;
