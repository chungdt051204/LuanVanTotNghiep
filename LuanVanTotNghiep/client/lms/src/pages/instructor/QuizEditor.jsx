import { useNavigate, useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { setCourses } from "../../stores/features/courseSlice";
import { courseService } from "../../services/courseService";
import { testService } from "../../services/testService";
import { questionService } from "../../services/questionService";
const QuizEditor = () => {
  const navigate = useNavigate();
  const { quizId } = useParams();
  const duration_minutes = [15, 20, 30, 45, 60];
  const pass_scores = [50, 60, 70, 80, 90];
  const dispatch = useDispatch();
  const courses = useSelector((state) => state.courses.items);
  const [testInfo, setTestInfo] = useState({
    testName: "",
    courseId: "",
    durationMinutes: duration_minutes[2],
    passScore: pass_scores[2],
  });
  const [questions, setQuestions] = useState([
    {
      questionContent: "",
      options: [
        { optionContent: "", isCorrect: true },
        { optionContent: "", isCorrect: false },
        { optionContent: "", isCorrect: false },
        { optionContent: "", isCorrect: false },
      ],
    },
  ]);
  useEffect(() => {
    if (quizId) {
      const getTestById = async () => {
        try {
          const result = await testService.getTestById({ testId: quizId });
          console.log(result);
          setTestInfo({
            testName: result.data?.test_name || "",
            courseId: result.data?.course_id || "",
            durationMinutes:
              result.data?.duration_minutes || duration_minutes[2],
            passScore: result.data?.pass_score || pass_scores[2],
          });
        } catch (error) {
          const status = error.status;
          const message = error.data.message;
          console.log(status, message);
        }
      };
      getTestById();
      const getQuestionsByTest = async () => {
        try {
          const result = await questionService.getQuestionsByTest({
            testId: quizId,
          });
          console.log(result.data);
        } catch (error) {
          const status = error.status;
          const message = error.data.message;
          console.log(status, message);
        }
      };
      getQuestionsByTest();
    }
  }, [quizId]);
  useEffect(() => {
    const getCoursesByInstructor = async () => {
      try {
        const result = await courseService.getCoursesByInstructor();
        console.log(result);
        dispatch(setCourses(result.data));
      } catch (error) {
        const status = error.status;
        const message = error.data.message;
        console.log(status, message);
      }
    };
    getCoursesByInstructor();
  }, [dispatch]);
  const handleSave = async (e) => {
    e.preventDefault();
    if (testInfo.courseId === "") {
      alert("Vui lòng chọn khóa học!");
      return;
    } else {
      const formData = {
        testName: testInfo.testName,
        courseId: testInfo.courseId,
        durationMinutes: testInfo.durationMinutes,
        passScore: testInfo.passScore,
        questions: questions,
      };
      try {
        const result = await testService.createTest({
          formData,
        });
        alert(result.message || "Tạo bài kiểm tra thành công");
        navigate("/instructor/quizzes");
      } catch (error) {
        const status = error.status;
        const message = error.data.message;
        console.log(status, message);
      }
    }
  };
  return (
    <>
      <div className="flex flex-col border">
        <p>Tạo bài kiểm tra mới</p>
        <p>Tạo bài kiểm tra trắc nghiệm cho khóa học của bạn</p>
      </div>
      <br />
      <form onSubmit={handleSave}>
        {/* Test Info */}
        <div className="flex flex-col border">
          <p>Thông tin bài kiểm tra</p>
          <p>Thiết lập các thông tin cơ bản</p>
          <label htmlFor="testName">Tên bài kiểm tra</label>
          <input
            value={testInfo.testName}
            onChange={(e) =>
              setTestInfo((prev) => ({ ...prev, testName: e.target.value }))
            }
            type="text"
            placeholder="Bài kiểm  tra kết thúc khóa học ReactJS"
            required
          />
          <label htmlFor="course">Khóa học</label>
          <select
            onChange={(e) =>
              setTestInfo((prev) => ({ ...prev, courseId: e.target.value }))
            }
            value={testInfo.courseId}
          >
            <option value="">Chọn khóa học</option>
            {courses?.map((value) => {
              return (
                <option key={value._id} value={value._id}>
                  {value.course_name}
                </option>
              );
            })}
          </select>
          <div className="flex gap-x-2">
            <div className="flex flex-col">
              <label htmlFor="durationMinutes">Thời gian làm bài (phút)</label>
              <select
                onChange={(e) =>
                  setTestInfo((prev) => ({
                    ...prev,
                    durationMinutes: e.target.value,
                  }))
                }
                value={testInfo.durationMinutes}
              >
                {duration_minutes?.map((value, index) => {
                  return (
                    <option key={index} value={value}>
                      {`${value} phút`}
                    </option>
                  );
                })}
              </select>
            </div>
            <div className="flex flex-col">
              <label htmlFor="passScore">Điểm đạt (%)</label>
              <select
                onChange={(e) =>
                  setTestInfo((prev) => ({
                    ...prev,
                    passScore: e.target.value,
                  }))
                }
                value={testInfo.passScore}
              >
                {pass_scores?.map((value, index) => {
                  return (
                    <option key={index} value={value}>
                      {`${value} %`}
                    </option>
                  );
                })}
              </select>
            </div>
          </div>
        </div>
        <br />
        {/* Câu hỏi */}
        <div className="flex justify-between">
          <p>Câu hỏi ({questions.length})</p>
          <button
            type="button"
            onClick={() =>
              setQuestions((prev) => [
                ...prev,
                {
                  questionContent: "",
                  options: [
                    { optionContent: "", isCorrect: true },
                    { optionContent: "", isCorrect: false },
                    { optionContent: "", isCorrect: false },
                    { optionContent: "", isCorrect: false },
                  ],
                },
              ])
            }
          >
            Thêm câu hỏi
          </button>
        </div>
        <div className="flex flex-col gap-x-2">
          {questions?.map((value, index) => {
            return (
              <div key={index} className="border">
                <div className="flex justify-between">
                  <p>Câu hỏi {index + 1}</p>
                  {questions.length > 1 && (
                    <button
                      onClick={() => {
                        const newQuestions = [...questions];
                        setQuestions(
                          newQuestions.filter((_, idx) => idx !== index)
                        );
                      }}
                    >
                      X
                    </button>
                  )}
                </div>
                <textarea
                  onChange={(e) => {
                    const newQuestions = [...questions];
                    newQuestions[index]["questionContent"] = e.target.value;
                    setQuestions(newQuestions);
                  }}
                  value={questions[index].questionContent}
                  cols={100}
                  placeholder="Nhập nội dung câu hỏi"
                ></textarea>
                <p>Đáp án (chọn đáp án đúng)</p>
                <div className="flex flex-col gap-y-2">
                  {value.options?.map((_, idx) => {
                    const options = ["A", "B", "C", "D"];
                    return (
                      <div key={idx} className="flex">
                        <input
                          type="radio"
                          onChange={() => {
                            const newQuestions = [...questions];
                            newQuestions[index].options = newQuestions[
                              index
                            ].options?.map((option, optionIndex) => ({
                              ...option,
                              isCorrect: optionIndex == idx,
                            }));
                            setQuestions(newQuestions);
                          }}
                          checked={questions[index].options[idx].isCorrect}
                        />
                        <input
                          value={questions[index].options[idx].optionContent}
                          onChange={(e) => {
                            const newQuestions = [...questions];
                            const options = newQuestions[index].options;
                            const newOptions = [...options];
                            newOptions[idx].optionContent = e.target.value;
                            newQuestions[index].options = newOptions;
                            setQuestions(newQuestions);
                          }}
                          key={index}
                          className="border"
                          placeholder={`Đáp án ${options[idx]}`}
                        />
                      </div>
                    );
                  })}
                </div>
              </div>
            );
          })}
        </div>
        <button type="button" onClick={() => console.log(questions)}>
          Save
        </button>
        <button>Lưu</button>
      </form>
    </>
  );
};
export default QuizEditor;
