import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import Navbar from "../../components/Navbar";
import { enrollmentService } from "../../services/enrollmentService";
import { setEnrollments } from "../../stores/features/enrollmentSlice";
import { Progress } from "antd";
import { IoPlayOutline } from "react-icons/io5";

const MyCourses = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { item: me, isLoading } = useSelector((state) => state.me);
  const { items: enrollments } = useSelector((state) => state.enrollments);
  useEffect(() => {
    if (!sessionStorage.getItem("token")) {
      navigate("/");
      return;
    }
    if (!isLoading && me?.role_id?.role !== "user") {
      navigate("/");
      return;
    }
  }, [isLoading, me, navigate]);
  useEffect(() => {
    const getEnrollmentsByUser = async () => {
      try {
        const result = await enrollmentService.getEnrollmentsByUser();
        console.log(result.data);
        dispatch(setEnrollments(result.data));
      } catch (error) {
        const status = error.status;
        const message = error.data.message;
        console.log(status, message);
      }
    };
    getEnrollmentsByUser();
  }, [dispatch]);
  if (isLoading) return <div>Đang tải dữ liệu...</div>;

  return (
    <>
      <Navbar />
      <div className="py-24 px-40 bg-surface-white">
        <div className="flex flex-col gap-y-2 justify-between">
          <p className="text-display-sm text-surface-nav font-bold">
            Khóa học của tôi
          </p>
          <p className="text-title-lg text-nav-muted">
            Theo dõi tiến độ các khóa học đã đăng ký
          </p>
        </div>
        <div className="flex flex-wrap gap-4 mt-10">
          {enrollments?.map((value) => {
            return (
              <div
                key={value._id}
                className="flex flex-col w-[49%] rounded-[16px] transition-shadow duration-300 hover:shadow-md"
              >
                <img
                  className="w-full h-[250px] rounded-t-[16px]"
                  src={value?.course_id?.thumbnail_url}
                  alt=""
                />
                <div className="flex flex-col gap-y-3 p-6 border border-gray-300 rounded-b-[16px]">
                  <p className="text-headline-sm text-surface-nav font-medium">
                    {value?.course_id?.course_name}
                  </p>
                  <Progress
                    className="font-medium"
                    percent={value.progress_percent}
                    strokeColor="black"
                    style={{ fontSize: 16 }}
                  />
                  <div className="flex justify-between text-title-sm text-nav-muted">
                    <p>
                      {value.completed_lessons}/{value.total_lessons} bài học
                    </p>
                    <p>0/1 bài kiểm tra</p>
                  </div>
                  <button
                    onClick={() => navigate(`/course/${value?.course_id?._id}`)}
                    className="flex gap-x-4 items-center px-32 py-2 rounded-[8px] bg-surface-nav text-title-lg text-surface-white font-medium transition-transform duration-300 hover:cursor-pointer hover:text-surface-bg"
                  >
                    <IoPlayOutline />
                    Tiếp tục học
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </>
  );
};
export default MyCourses;
