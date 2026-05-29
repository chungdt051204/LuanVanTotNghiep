import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { useEffect } from "react";
import { testService } from "../../services/testService";
import { setTests } from "../../stores/features/testSlice";
import { IoEyeOutline } from "react-icons/io5";
import { LuSquarePen } from "react-icons/lu";
import { RiDeleteBinLine } from "react-icons/ri";
const Quizzes = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const tests = useSelector((state) => state.tests.items);
  useEffect(() => {
    const getTestsByInstructor = async () => {
      try {
        const result = await testService.getTestsByInstructor();
        console.log(result.data);
        dispatch(setTests(result.data));
      } catch (error) {
        const status = error.status;
        const message = error.data.message;
        console.log(status, message);
      }
    };
    getTestsByInstructor();
  }, [dispatch]);
  return (
    <>
      <div className="flex justify-between border">
        <div className="flex flex-col">
          <p>Quản lý bài kiểm tra</p>
          <p>Tạo và quản lý các bài kiểm tra trắc nghiệm</p>
        </div>
        <button
          onClick={() => navigate("/instructor/quiz/create")}
          className="border"
        >
          Tạo bài kiểm tra
        </button>
      </div>
      <br />
      <div className="flex flex-col border">
        <div className="flex flex-col">
          <p>Danh sách bài kiểm tra</p>
          <p>{`${tests.length} bài kiểm tra`}</p>
        </div>
        <table>
          <thead>
            <tr>
              <td>Tên bài kiểm tra</td>
              <td>Khóa học</td>
              <td>Số câu hỏi</td>
              <td>Thời gian</td>
              <td>Lượt làm</td>
              <td>Điểm trung bình</td>
              <td>Trạng thái</td>
              <td>Hành động</td>
            </tr>
          </thead>
          <tbody>
            {tests?.map((value) => {
              return (
                <tr key={value._id}>
                  <td className="flex flex-col">
                    <p>{value.test_name}</p>
                    <p>{value.createdAt}</p>
                  </td>
                  <td>{value.course_id.course_name}</td>
                  <td></td>
                  <td>{value.duration_minutes}</td>
                  <td></td>
                  <td></td>
                  <td>{value.status ? "Hoạt động" : "Nháp"}</td>
                  <td>
                    {!value.status && (
                      <div className="flex gap-x-1 items-center">
                        <IoEyeOutline />
                        <RiDeleteBinLine />
                        <LuSquarePen
                          onClick={() =>
                            navigate(`/instructor/quiz/${value._id}/edit`)
                          }
                        />
                        <button>Kích hoạt</button>
                      </div>
                    )}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </>
  );
};
export default Quizzes;
