import { useEffect, useState } from "react";
import Navbar from "../../components/Navbar";
import { useSelector } from "react-redux";
import { format } from "../../../helper/format";
import { FaRegCalendarAlt } from "react-icons/fa";
import { IoCameraOutline } from "react-icons/io5";
import { useNavigate } from "react-router-dom";
import { validateForm } from "../../../helper/validateForm";
import { userService } from "../../services/userService";
import { toast } from "react-toastify";
import Footer from "../../components/Footer";
import { LuSave } from "react-icons/lu";
import { MdLockOutline } from "react-icons/md";

const MyProfile = () => {
  const navigate = useNavigate();
  const { item: me, isLoading } = useSelector((state) => state.me);
  const [accountInfo, setAccountInfo] = useState({
    fullName: "",
    phone: "",
    password: "",
    confirmPassword: "",
    avatar: null,
  });
  const [fullName, setFullName] = useState("");
  const [avatarPreview, setAvatarPreview] = useState(null);
  const [error, setError] = useState({
    errorFullName: "",
    errorPhone: "",
    errorPassword: "",
    errorConfirmPassword: "",
    errorFile: "",
  });

  const handlePreview = ({ e, setPreview }) => {
    const allowedTypes = ["jpg", "png", "jpeg"];
    const image = e.target.files[0];
    const type = image?.name?.split(".")[1];
    if (!allowedTypes.includes(type)) {
      setError((prev) => ({
        ...prev,
        errorFile: "Định dạng ảnh không hợp lệ!",
      }));
      setPreview(accountInfo.avatar);
      return;
    } else {
      const previewUrl = URL.createObjectURL(image);
      setPreview(previewUrl);
      setError((prev) => ({ ...prev, errorFile: "" }));
    }
  };
  useEffect(() => {
    if (!sessionStorage.getItem("token")) {
      navigate("/");
      return;
    }
  }, [isLoading, me, navigate]);

  useEffect(() => {
    if (me) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setAccountInfo((prev) => ({
        ...prev,
        fullName: me?.full_name || "",
        phone: me?.phone || "",
        avatar: me?.avatar || null,
      }));
      setFullName(me?.full_name || "");
    }
  }, [me]);
  const handleUpdateAvatar = async () => {
    const data = {
      avatar: accountInfo.avatar,
    };
    if (!validateForm.validateUserForm({ formData: data, setError })) return;
    const formData = new FormData();
    formData.append("avatar", accountInfo.avatar);
    try {
      const result = await userService.updateAvatar({ avatar: formData });
      toast.success(result?.message || "Cập nhật ảnh đại diện thành công");
      navigate("/");
    } catch (error) {
      const status = error.status;
      const message = error.data.message;
      console.log(status, message);
    }
  };
  const handleUpdateProfile = async () => {
    const data = {
      fullName: accountInfo.fullName,
      phone: accountInfo.phone,
    };
    if (!validateForm.validateUserForm({ formData: data, setError })) return;
    try {
      const result = await userService.updateProfile({ data });
      toast.success(result?.message || "Cập nhật thông tin thành công");
      navigate("/");
    } catch (error) {
      const status = error.status;
      const message = error.data.message;
      console.log(status, message);
    }
  };
  const handleChangePassword = async () => {
    const data = {
      password: accountInfo.password,
      confirmPassword: accountInfo.confirmPassword,
    };
    if (!validateForm.validateUserForm({ formData: data, setError })) return;
    const formData = {
      password: accountInfo.password,
    };
    try {
      const result = await userService.changePassword({
        password: formData,
      });
      toast.success(result?.message || "Thay đổi mật khẩu thành công");
      navigate("/login");
    } catch (error) {
      const status = error.status;
      const message = error.data.message;
      console.log(status, message);
    }
  };
  if (isLoading) return <div className="text-center">Đang tải dữ liệu...</div>;
  return (
    <>
      <Navbar />
      <div className="p-24">
        <div className="flex flex-col gap-y-2 justify-between">
          <p className="text-display-sm text-surface-nav font-bold">
            Tài khoản của tôi
          </p>
          <p className="text-title-lg text-nav-muted">
            Quản lý thông tin cá nhân của bạn
          </p>
        </div>
        <div className="flex justify-between items-start mt-6">
          <div className="flex flex-col gap-y-4 w-[34%] border border-gray-300 rounded-[16px] px-5 pt-5 pb-10">
            <div className="relative flex flex-col gap-y-1 text-center">
              <img
                className="w-[180px] h-[180px] object-cover rounded-[1000px] mx-auto"
                src={avatarPreview || accountInfo.avatar}
                alt=""
              />
              <label
                htmlFor="avatar"
                className="absolute p-2 top-[130px] left-[200px] rounded-[1000px] bg-surface-nav"
              >
                <IoCameraOutline className="text-headline-md text-surface-white" />
              </label>
              <input
                onChange={(e) => {
                  setAccountInfo((prev) => ({
                    ...prev,
                    avatar: e.target.files[0],
                  }));
                  handlePreview({ e, setPreview: setAvatarPreview });
                }}
                id="avatar"
                className="hidden"
                type="file"
              />
              <span className="text-body-md text-red-500 font-medium">
                {error.errorFile}
              </span>
              <p className="text-title-lg text-surface-nav font-medium">
                {fullName}
              </p>
              <p className="text-title-sm text-nav-muted">{me?.email || ""}</p>
              <button
                onClick={handleUpdateAvatar}
                className="flex justify-center px-2 py-1 mt-2 rounded-[8px] bg-surface-nav text-title-lg text-surface-white transition-transform duration-300 hover:text-surface-bg hover:cursor-pointer"
              >
                <div className="flex gap-x-2 items-center">
                  <LuSave />
                  Cập nhật ảnh đại diện
                </div>
              </button>
            </div>
            <div className="flex gap-x-4 items-center p-2 border border-gray-300 rounded-[8px] text-nav-muted">
              <FaRegCalendarAlt className="text-title-lg" />
              <div className="flex flex-col gap-y-2 text-title-sm">
                <p>Ngày tham gia hệ thống</p>
                <p>{format.formatDate({ date: me?.createdAt })}</p>
              </div>
            </div>
          </div>
          <form className="flex flex-col gap-y-4 w-[64%] border border-gray-300 rounded-[16px] p-5">
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
                  onChange={(e) => {
                    setAccountInfo((prev) => ({
                      ...prev,
                      fullName: e.target.value,
                    }));
                    setError((prev) => ({ ...prev, errorFullName: "" }));
                  }}
                  value={accountInfo.fullName}
                  placeholder="Nhập họ tên"
                />
                <span className="text-body-md text-red-500 font-medium">
                  {error.errorFullName}
                </span>
              </div>
              <div className="flex flex-col gap-y-1 w-[40%]">
                <label
                  className="text-title-sm text-surface-nav font-medium"
                  htmlFor="email"
                >
                  Email
                </label>
                <input
                  className="px-2 py-1 border border-gray-300 rounded-[8px] hover:cursor-not-allowed"
                  type="text"
                  value={me?.email || ""}
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
                  onChange={(e) => {
                    setAccountInfo((prev) => ({
                      ...prev,
                      phone: e.target.value,
                    }));
                    setError((prev) => ({ ...prev, errorPhone: "" }));
                  }}
                  value={accountInfo.phone}
                  placeholder="Nhập số điện thoại"
                />
                <span className="text-body-md text-red-500 font-medium">
                  {error.errorPhone}
                </span>
              </div>
            </div>
            <div className="flex justify-end">
              <button
                type="button"
                onClick={handleUpdateProfile}
                className="flex justify-center w-[35%] px-2 py-1 mt-2 rounded-[8px] bg-surface-nav text-title-lg text-surface-white transition-transform duration-300 hover:text-surface-bg hover:cursor-pointer"
              >
                <div className="flex gap-x-2 items-center">
                  <LuSave />
                  Lưu thông tin
                </div>
              </button>
            </div>
            <hr className="text-gray-300" />
            <p className="text-title-lg text-surface-nav font-medium">
              Đổi mật khẩu
            </p>
            <div className="flex flex-col gap-y-2">
              <div className="flex flex-col gap-y-1">
                <label
                  className="text-title-sm text-surface-nav font-medium"
                  htmlFor="newPassword"
                >
                  Mật khẩu mới
                </label>
                <input
                  className="px-2 py-1 border border-gray-300 rounded-[8px]"
                  type="password"
                  onChange={(e) => {
                    setAccountInfo((prev) => ({
                      ...prev,
                      password: e.target.value,
                    }));
                    setError((prev) => ({ ...prev, errorPassword: "" }));
                  }}
                  placeholder="Nhập mật khẩu mới"
                  autoComplete="new-password"
                />
                <span className="text-body-md text-red-500 font-medium">
                  {error.errorPassword}
                </span>
              </div>
              <div className="flex flex-col gap-y-1">
                <label
                  className="text-title-sm text-surface-nav font-medium"
                  htmlFor="confirmNewPassword"
                >
                  Xác nhận mật khẩu mới
                </label>
                <input
                  className="px-2 py-1 border border-gray-300 rounded-[8px]"
                  type="password"
                  onChange={(e) => {
                    setAccountInfo((prev) => ({
                      ...prev,
                      confirmPassword: e.target.value,
                    }));
                    setError((prev) => ({ ...prev, errorConfirmPassword: "" }));
                  }}
                />
                <span className="text-body-md text-red-500 font-medium">
                  {error.errorConfirmPassword}
                </span>
              </div>
            </div>
            <div className="flex justify-end">
              <button
                type="button"
                onClick={handleChangePassword}
                className="flex justify-center w-[35%] px-2 py-1 mt-2 rounded-[8px] bg-surface-nav text-title-lg text-surface-white transition-transform duration-300 hover:text-surface-bg hover:cursor-pointer"
              >
                <div className="flex gap-x-2 items-center">
                  <MdLockOutline />
                  Đổi mật khẩu
                </div>
              </button>
            </div>
          </form>
        </div>
      </div>
      <Footer />
    </>
  );
};
export default MyProfile;
