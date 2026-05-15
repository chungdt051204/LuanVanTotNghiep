import { useNavigate } from "react-router-dom";

const InstructorCourses = () => {
  const navigate = useNavigate();
  return (
    <>
      <div className="flex">
        <div>
          <p>Quản lý khóa học</p>
          <p>Tạo và quản lý các khóa học của bạn</p>
        </div>
        <button
          onClick={() => navigate("/instructor/courses/add")}
          className="ms-2 border"
        >
          Tạo khóa học mới
        </button>
      </div>
    </>
  );
};
export default InstructorCourses;
