import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { courseService } from "../services/courseService";
import { setCourses } from "../stores/features/courseSlice";
import { useNavigate } from "react-router-dom";
const ListCourses = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { items: courses, isLoading } = useSelector((state) => state.courses);
  useEffect(() => {
    const getApprovedCourses = async () => {
      try {
        const result = await courseService.getApprovedCourses();
        console.log(result.data);
        dispatch(setCourses(result.data));
      } catch (error) {
        const status = error.status;
        const message = error.message;
        console.log(status, message);
      }
    };
    getApprovedCourses();
  }, [dispatch]);
  if (isLoading) return <p>Đang tải dữ liệu...</p>;
  return (
    <>
      {courses?.length > 0 ? (
        courses.map((value) => {
          return (
            <div
              key={value._id}
              className="flex flex-col w-[30%] p-4 border mt-4"
            >
              <img src={value.image_url} alt="" width={200} height={150} />
              <div className="flex gap-x-1 items-center">
                <img src={value.user_id.avatar} alt="" width={40} height={40} />
                <p>{value.user_id.full_name}</p>
              </div>
              <p>{value.course_name}</p>
              <div className="flex justify-between items-center">
                <p>{value.price}</p>
                <button
                  onClick={() => navigate(`/course/${value._id}`)}
                  className="border"
                >
                  Xem chi tiết
                </button>
              </div>
            </div>
          );
        })
      ) : (
        <p>Không tìm thấy khóa học để hiển thị</p>
      )}
    </>
  );
};
export default ListCourses;
