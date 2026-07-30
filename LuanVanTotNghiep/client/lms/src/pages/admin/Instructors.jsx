import { useNavigate, useSearchParams } from "react-router-dom";
import { useEffect, useRef, useState } from "react";
import { userService } from "../../services/userService";
import { IoListOutline } from "react-icons/io5";
import { CiCircleCheck } from "react-icons/ci";
import { IoBan } from "react-icons/io5";
import { IoEyeOutline } from "react-icons/io5";
import { LuInbox } from "react-icons/lu";
import { toast } from "react-toastify";
import PaginationButton from "../../components/PaginationButton";
import ConfirmDialog from "../../components/ConfirmDialog";

const Instructors = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [instructors, setInstructors] = useState([]);
  const [instructor, setInstructor] = useState(null);
  const [refresh, setRefresh] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const filterTabs = [
    {
      status: "",
      title: "Tất cả giảng viên",
      icon: <IoListOutline />,
    },
    {
      status: "active",
      title: "Đang hoạt động",
      icon: <CiCircleCheck />,
    },
    {
      status: "inactive",
      title: "Ngừng hoạt động",
      icon: <IoBan />,
    },
  ];
  const [status, setStatus] = useState("");
  const [idx, setIdx] = useState(0);
  const [message, setMessage] = useState("");
  const confirmDialog = useRef(0);

  useEffect(() => {
    const getInstructors = async () => {
      try {
        const params = new URLSearchParams(searchParams);
        params.append("limit", 5);
        if (status) params.append("status", status);
        const result = await userService.getInstructors({
          params: params.toString(),
        });
        console.log(result.data);
        setInstructors(result.data);
      } catch (error) {
        const status = error.status;
        const message = error.data.message;
        console.log(status, message);
      } finally {
        setIsLoading(false);
      }
    };
    getInstructors();
  }, [refresh, searchParams, status]);
  const handleUpdateStatusInstructor = async () => {
    try {
      const result = await userService.updateStatusUser({
        userId: instructor?._id,
      });
      console.log(result);
      confirmDialog?.current?.close();
      setRefresh((prev) => prev + 1);
      toast.success(
        result?.message || "Vô hiệu hóa/Kích hoạt tài khoản thành công"
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
        <div className="h-[70px] flex flex-col justify-between">
          <p className="text-display-sm text-surface-nav font-bold">
            Quản lý giảng viên
          </p>
          <p className="text-title-lg text-nav-muted">
            Xem và quản lý tất cả giảng viên trên nền tảng
          </p>
        </div>
        <div className="flex mt-6 border border-gray-300 rounded-[8px] w-[95%]">
          {filterTabs?.map((value, index) => {
            const borderBottomColors = [
              "border-b-2 border-b-blue-600",
              "border-b-2 border-b-green-600",
              "border-b-2 border-b-red-600",
            ];
            const textColors = [
              "text-blue-600",
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
        <div className="flex flex-col gap-y-6 w-[95%]">
          {isLoading ? (
            <p>Đang tải dữ liệu...</p>
          ) : instructors?.arrayInstructor?.length == 0 ? (
            <div className="flex flex-col items-center gap-y-2 text-title-sm text-nav-muted w-[95%] mt-6">
              <LuInbox className="text-display-md text-gray-300" />
              <p>Chưa có giảng viên nào</p>
            </div>
          ) : (
            <table className="border-separate border-spacing-0 overflow-hidden border-1 border-surface-bg rounded-[16px] mt-6">
              <thead>
                <tr className="flex items-center justify-between text-surface-nav font-medium">
                  <td className="w-[35%] p-2">Giảng viên</td>
                  <td className="w-[10%]">Khóa học</td>
                  <td className="w-[15%] text-center">Trạng thái</td>
                  <td className="w-[20%] p-2 text-right">Thao tác</td>
                </tr>
              </thead>
              <tbody>
                {instructors?.arrayInstructor?.map((value) => {
                  return (
                    <tr
                      className="flex justify-between items-center border border-surface-bg hover:bg-surface-bg"
                      key={value?.item?._id}
                    >
                      <td className="flex items-center gap-x-2 w-[35%] p-2">
                        <img
                          className="w-[40px] h-[40px] rounded-[1000px] object-cover"
                          src={value?.item?.avatar}
                        />
                        <div>
                          <p className="text-surface-nav text-title-lg font-medium">
                            {value?.item?.full_name}
                          </p>
                          <p className="text-nav-muted text-body-lg">
                            {value?.item?.email}
                          </p>
                        </div>
                      </td>
                      <td className="w-[10%] text-title-sm text-surface-nav">
                        {value?.numberCourse}
                      </td>
                      <td className="w-[15%]">
                        <p
                          className={`text-body-md text-center font-medium rounded-[8px] ${
                            value?.item?.status
                              ? "text-green-700 bg-green-100"
                              : "text-red-700 bg-red-100"
                          } `}
                        >
                          {value?.item?.status
                            ? "Đang hoạt động"
                            : "Ngừng hoạt động"}
                        </p>
                      </td>
                      <td className="flex justify-end gap-x-2 items-center w-[20%] pe-2">
                        <IoEyeOutline
                          onClick={() =>
                            navigate(`/admin/instructor/${value?.item?._id}`)
                          }
                        />
                        <button
                          onClick={() => {
                            const instructorId = value?.item?._id;
                            const instructor =
                              instructors?.arrayInstructor?.find(
                                (value) => value?.item?._id === instructorId
                              );
                            setInstructor(instructor?.item);
                            setMessage(
                              `Bạn có muốn ${
                                value?.item?.status
                                  ? "vô hiệu hóa"
                                  : "kích hoạt"
                              } tài khoản giảng viên này không ? `
                            );
                            confirmDialog?.current?.showModal();
                          }}
                          className={`px-2 py-1 rounded-[8px] text-title-sm text-surface-white ${
                            value?.item?.status ? "bg-red-600" : "bg-green-600"
                          } transition-transform duration-300 hover:text-surface-bg hover:cursor-pointer`}
                        >
                          {value?.item?.status ? "Vô hiệu hóa" : "Kích hoạt"}
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          )}
          {instructors?.totalPages > 1 && (
            <PaginationButton totalPages={instructors?.totalPages} />
          )}
        </div>
      </div>
      <ConfirmDialog
        ref={confirmDialog}
        message={message}
        handleClick={handleUpdateStatusInstructor}
      />
    </>
  );
};
export default Instructors;
