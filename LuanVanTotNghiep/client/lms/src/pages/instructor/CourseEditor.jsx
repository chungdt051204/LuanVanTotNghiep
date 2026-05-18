import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { courseService } from "../../services/courseService";
import { lessonService } from "../../services/lessonService";
import { toast } from "react-toastify";
import { validateForm } from "../../../helper/validateForm";
import { useNavigate, useParams } from "react-router-dom";
import { FaPlus } from "react-icons/fa6";

const CourseEditor = () => {
  const navigate = useNavigate();
  const { courseId } = useParams();
  const isEdit = courseId ? true : false;
  const categories = useSelector((state) => state.categories.items);
  const levels = ["Cơ bản", "Trung bình", "Nâng cao"];
  const [courseInfo, setCourseInfo] = useState({
    courseName: "",
    description: "",
    category_id: "",
    level: "",
    image: null,
    thumbnail: null,
    price: "",
  });
  const [requirements, setRequirements] = useState([]);
  const [objectives, setObjectives] = useState([]);
  const [requirementContent, setRequirementContent] = useState("");
  const [objectiveContent, setObjectiveContent] = useState("");
  const [lessons, setLessons] = useState([
    { lessonName: "", videoUrl: "", duration: "" },
  ]);
  const validateLessons =
    lessons.filter(
      (value) =>
        value.lessonName.trim() !== "" &&
        value.videoUrl.trim() !== "" &&
        value.duration.trim() !== ""
    ) || [];
  const [error, setError] = useState({
    errorCourseName: "",
    errorDescription: "",
    errorCategory: "",
    errorLevel: "",
    errorFile: "",
    errorPrice: "",
  });
  useEffect(() => {
    console.log(requirements);
    console.log(objectives);
  }, [requirements, objectives]);
  useEffect(() => {
    if (courseId) {
      const getCourseById = async () => {
        const result = await courseService.getCourseById({ courseId });
        console.log(result);
        setCourseInfo({
          courseName: result.data.course_name || "",
          description: result.data.description || "",
          category_id: result.data.category_id || "",
          level: result.data.level || "",
          image: result.data.image_url || null,
          thumbnail: result.data.thumbnail_url || null,
          price: result.data.price,
        });
        result.data.requirements?.forEach((value) => {
          setRequirements((prev) => [...prev, value]);
        });
        result.data.objectives?.forEach((value) => {
          setObjectives((prev) => [...prev, value]);
        });
      };
      getCourseById();
      const getLessonsByCourse = async () => {
        const result = await lessonService.getLessonsByCourse({ courseId });
        const formattedLessons = result.data?.map((value) => {
          return {
            lessonId: value._id,
            lessonName: value.lesson_name,
            videoUrl: value.video_url,
            duration: value.duration,
          };
        });
        setLessons(formattedLessons);
      };
      getLessonsByCourse();
    }
  }, [courseId]);

  const handleSetCourseInfo = ({ e, setCourseInfo, field }) => {
    const { value } = e.target;
    setCourseInfo((prev) => ({ ...prev, [field]: value }));
  };
  const handleAddItem = ({ content, setContent, setArray }) => {
    if (!content) {
      alert("Vui lòng nhập đầy đủ thông tin!");
      return;
    }
    setArray((prev) => [...prev, content]);
    setContent("");
  };
  const handleDeleteItem = ({ index, array, setArray }) => {
    setArray(
      //Filter cũng giống map có value và index
      array.filter((_, i) => i !== index)
    );
  };
  const handleSetLesson = ({ fieldName, index, e, array, setArray }) => {
    const { value } = e.target;
    const newArray = [...array];
    newArray[index][fieldName] = value;
    setArray(newArray);
  };
  const handleDeleteLesson = async ({ index }) => {
    if (!lessons[index].lessonId)
      setLessons(lessons?.filter((_, i) => i !== index));
    else {
      try {
        await lessonService.deleteLesson({
          lessonId: lessons[index].lessonId,
        });
      } catch (error) {
        const status = error.status;
        const message = error.message;
        console.log(status, message);
      }
    }
  };
  const handleSetError = ({ setError, field }) => {
    setError((prev) => ({ ...prev, [field]: "" }));
  };
  const handleSave = async (e) => {
    e.preventDefault();
    console.log(courseInfo.image, courseInfo.thumbnail);
    if (validateForm.validateFormCourse({ courseInfo, isEdit, setError })) {
      const formData = new FormData();
      formData.append("courseName", courseInfo.courseName);
      formData.append("description", courseInfo.description);
      formData.append("category_id", courseInfo.category_id);
      formData.append("level", courseInfo.level);
      formData.append("image", courseInfo.image);
      formData.append("thumbnail", courseInfo.thumbnail);
      requirements?.forEach((value) => {
        formData.append("requirements", value);
      });
      objectives?.forEach((value) => {
        formData.append("objectives", value);
      });
      formData.append("price", courseInfo.price);
      formData.append("lessons", JSON.stringify(validateLessons)); //Vì FormData không có object lồng nhau nên dùng JSON.stringify để biến mảng thành chuỗi
      if (isEdit) {
        try {
          const result = await courseService.updateCourse({
            courseId,
            data: formData,
          });
          toast.success(result.message || "Cập nhật thành công");
          navigate("/instructor/courses");
        } catch (error) {
          const status = error.status;
          const message = error.data.message;
          console.log(status, message);
        }
      } else {
        try {
          const result = await courseService.addCourse({ data: formData });
          toast.success(result.message || "Tạo khóa học thành công");
          navigate("/instructor/courses");
        } catch (error) {
          const status = error.status;
          const message = error.data.message;
          if (status === 409)
            setError((prev) => ({ ...prev, errorCourseName: message }));
          console.log(message);
        }
      }
    }
  };

  return (
    <>
      <div className="py-8">
        <div className="h-[70px] flex flex-col justify-between">
          <p className="text-display-sm text-surface-nav font-bold">
            {courseId ? "Chỉnh sửa khóa học" : "Tạo khóa học mới"}
          </p>
          <p className="text-title-lg text-nav-muted">
            {courseId
              ? "Chỉnh sửa thông tin khóa học của bạn"
              : "Điền thông tin khóa học của bạn"}
          </p>
        </div>
        <form className="mt-5" onSubmit={handleSave}>
          {/* Thông tin cơ bản */}
          <div className="flex flex-col justify-between h-[600px] border-1 border-surface-bg rounded-[16px] p-5">
            <p className="text-title-lg text-surface-nav font-medium">
              Thông tin cơ bản
            </p>
            <div className="flex flex-col justify-between h-[90%]">
              <label
                className="text-surface-nav text-body-lg font-medium"
                htmlFor="courseName"
              >
                Tên khóa học *
              </label>
              <input
                className="p-2 bg-surface-bg rounded-[8px]"
                value={courseInfo.courseName}
                onChange={(e) => {
                  handleSetCourseInfo({
                    e,
                    setCourseInfo,
                    field: "courseName",
                  });
                  handleSetError({ setError, field: "errorCourseName" });
                }}
                type="text"
                placeholder="React cơ bản và nâng cao"
              />
              <span>{error.errorCourseName}</span>
              <label
                className="text-surface-nav text-body-lg font-medium"
                htmlFor="description"
              >
                Mô tả *
              </label>
              <input
                className="p-2 bg-surface-bg rounded-[8px]"
                value={courseInfo.description}
                onChange={(e) =>
                  handleSetCourseInfo({
                    e,
                    setCourseInfo,
                    field: "description",
                  })
                }
                type="text"
                placeholder="Mô tả chi tiết về khóa học..."
              />
              <div className="flex justify-between w-[35%]">
                <div>
                  <label
                    className="text-surface-nav text-body-lg font-medium"
                    htmlFor="category"
                  >
                    Danh mục *
                  </label>
                  <div className="flex flex-col">
                    <select
                      className="p-2 bg-surface-white border-1 border-surface-bg rounded-[8px] text-nav-muted outline-none"
                      value={courseInfo.category_id}
                      onChange={(e) => {
                        handleSetCourseInfo({
                          e,
                          setCourseInfo,
                          field: "category_id",
                        });
                        handleSetError({ setError, field: "errorCategory" });
                      }}
                    >
                      <option value="">Chọn danh mục</option>
                      {categories?.map((value) => {
                        return (
                          <option key={value._id} value={value._id}>
                            {value.category_name}
                          </option>
                        );
                      })}
                    </select>
                    <span>{error.errorCategory}</span>
                  </div>
                </div>
                <div>
                  <label
                    className="text-surface-nav text-body-lg font-medium"
                    htmlFor="level"
                  >
                    Cấp độ *
                  </label>
                  <div className="flex flex-col">
                    <select
                      className="p-2 bg-surface-white border-1 border-surface-bg rounded-[8px] text-nav-muted outline-none"
                      value={courseInfo.level}
                      onChange={(e) => {
                        handleSetCourseInfo({
                          e,
                          setCourseInfo,
                          field: "level",
                        });
                        handleSetError({ setError, field: "errorLevel" });
                      }}
                    >
                      <option value="">Chọn cấp độ</option>
                      {levels?.map((value, index) => {
                        return (
                          <option key={index} value={value}>
                            {value}
                          </option>
                        );
                      })}
                    </select>
                    <span>{error.errorLevel}</span>
                  </div>
                </div>
              </div>
              <label
                className="text-surface-nav text-body-lg font-medium"
                htmlFor="image"
              >
                Ảnh khóa học *
              </label>
              <input
                onChange={(e) => {
                  setCourseInfo((prev) => ({
                    ...prev,
                    image: e.target.files[0],
                  }));
                  handleSetError({ setError, field: "errorFile" });
                }}
                type="file"
                accept="image/*"
              />
              <img src={courseInfo.image} className="w-[80px] h-[80px]"></img>
              <label
                className="text-surface-nav text-body-lg font-medium"
                htmlFor="thumbnail"
              >
                Ảnh bìa *
              </label>
              <input
                onChange={(e) => {
                  setCourseInfo((prev) => ({
                    ...prev,
                    thumbnail: e.target.files[0],
                  }));
                  handleSetError({ setError, field: "errorFile" });
                }}
                type="file"
                accept="image/*"
              />
              <img
                src={courseInfo.thumbnail}
                className="w-[200px] h-[100px]"
              ></img>
              <span>{error.errorFile}</span>
            </div>
          </div>
          {/* Yêu cầu & kết quả đạt được */}
          <div className="flex flex-col justify-between gap-y-3 mt-6 border border-surface-bg rounded-[16px] p-4">
            <p className="text-title-lg text-surface-nav font-medium">
              Yêu cầu & Kết quả đạt được
            </p>
            <div className="flex flex-col justify-between h-[90%]">
              <div>
                <p className="text-surface-nav text-body-lg font-medium">
                  Yêu cầu trước khi học
                </p>
                <p className="text-nav-muted text-body-lg">
                  Những kỹ năng cần có trước khi tham gia khóa học
                </p>
                <div className="flex justify-between">
                  <input
                    className="p-2 w-[88%] bg-surface-bg rounded-[8px]"
                    value={requirementContent}
                    onChange={(e) => setRequirementContent(e.target.value)}
                    type="text"
                    placeholder="Ví dụ: Hiểu biết cơ bản về HTML, CSS"
                  />
                  <button
                    type="button"
                    onClick={() =>
                      handleAddItem({
                        content: requirementContent,
                        setContent: setRequirementContent,
                        setArray: setRequirements,
                      })
                    }
                    className="flex items-center gap-x-2 px-4 py-2 rounded-[8px] bg-surface-nav text-body-lg text-surface-white transition-transform duration-300 hover:text-surface-bg hover:cursor-pointer"
                  >
                    <FaPlus />
                    Thêm
                  </button>
                </div>
                <ul className="mt-3">
                  {requirements.length > 0 ? (
                    requirements.map((value, index) => {
                      return (
                        <li className="flex justify-between mt-2" key={index}>
                          <div className="w-[92%] p-2 bg-gray-100 rounded-[8px]">
                            <p>{value}</p>
                          </div>
                          <button
                            onClick={() =>
                              handleDeleteItem({
                                index,
                                array: requirements,
                                setArray: setRequirements,
                              })
                            }
                            className="px-4 py-2 rounded-[8px] bg-surface-nav text-body-lg text-surface-white transition-transform duration-300 hover:text-surface-bg hover:cursor-pointer"
                            type="button"
                          >
                            Xóa
                          </button>
                        </li>
                      );
                    })
                  ) : (
                    <p className="italic text-body-lg text-nav-muted">
                      Chưa có yêu cầu nào
                    </p>
                  )}
                </ul>
              </div>
              <div className="mt-3">
                <p className="text-surface-nav text-body-lg font-medium">
                  Kết quả đạt được sau khóa học
                </p>
                <p className="text-nav-muted text-body-lg">
                  Những kỹ năng hoặc kiến thức mà học viên sẽ có được sau khi
                  hoàn thành khóa học
                </p>
                <div className="flex justify-between">
                  <input
                    className="p-2 w-[88%] bg-surface-bg rounded-[8px]"
                    value={objectiveContent}
                    onChange={(e) => setObjectiveContent(e.target.value)}
                    type="text"
                    placeholder="Ví dụ: Xây dựng được ứng dụng web hoàn chỉnh với React"
                  />
                  <button
                    onClick={() =>
                      handleAddItem({
                        content: objectiveContent,
                        setContent: setObjectiveContent,
                        setArray: setObjectives,
                      })
                    }
                    className="flex items-center gap-x-2 px-4 py-2 rounded-[8px] bg-surface-nav text-body-lg text-surface-white transition-transform duration-300 hover:text-surface-bg hover:cursor-pointer"
                    type="button"
                  >
                    <FaPlus />
                    Thêm
                  </button>
                </div>
                <ul className="mt-3">
                  {objectives.length > 0 ? (
                    objectives.map((value, index) => {
                      return (
                        <li className="flex justify-between mt-2" key={index}>
                          <div className="w-[92%] p-2 bg-gray-100 rounded-[8px]">
                            <p>{value}</p>
                          </div>
                          <button
                            onClick={() =>
                              handleDeleteItem({
                                index,
                                array: objectives,
                                setArray: setObjectives,
                              })
                            }
                            className="px-4 py-2 rounded-[8px] bg-surface-nav text-body-lg text-surface-white transition-transform duration-300 hover:text-surface-bg hover:cursor-pointer"
                            type="button"
                          >
                            Xóa
                          </button>
                        </li>
                      );
                    })
                  ) : (
                    <p className="italic text-body-lg text-nav-muted">
                      Chưa có kết quả đạt được nào
                    </p>
                  )}
                </ul>
              </div>
            </div>
          </div>
          <div className="border border-surface-bg rounded-[16px] mt-6 p-4">
            <div className="flex justify-between items-center">
              <p className="text-title-lg text-surface-nav font-medium">
                Nội dung khóa học
              </p>
              <button
                type="button"
                onClick={() => {
                  setLessons((prev) => [
                    ...prev,
                    { lessonName: "", videoUrl: "", duration: "" },
                  ]);
                }}
                className="w-[20%] flex items-center gap-x-4 p-2 border border-surface-bg rounded-[8px] transition-transform duration-300 hover:bg-surface-bg hover:cursor-pointer"
              >
                <FaPlus />
                Thêm bài học
              </button>
            </div>
            <div className="flex flex-col gap-y-3 mt-6">
              {lessons?.map((value, index) => {
                return (
                  <div
                    key={index}
                    className="border border-surface-bg rounded-[16px] py-4 ps-4 pe-8"
                  >
                    <div className="flex justify-between">
                      <p className="text-title-lg text-surface-nav font-medium">
                        Bài học {index + 1}
                      </p>
                      {lessons?.length > 1 && (
                        <button
                          type="button"
                          onClick={() => handleDeleteLesson({ index })}
                          className="text-body-lg text-surface-nav font-medium"
                        >
                          X
                        </button>
                      )}
                    </div>
                    <div className="mt-3">
                      <label
                        className="text-surface-nav text-body-lg font-medium"
                        htmlFor="lessonName"
                      >
                        Tiêu đề bài học *
                      </label>
                      <input
                        className="p-2 bg-surface-bg rounded-[8px] w-full"
                        value={value.lessonName}
                        onChange={(e) =>
                          handleSetLesson({
                            fieldName: "lessonName",
                            index,
                            e,
                            array: lessons,
                            setArray: setLessons,
                          })
                        }
                        type="text"
                        placeholder="Giới thiệu về React"
                      />
                      <label
                        className="text-surface-nav text-body-lg font-medium"
                        htmlFor="videoUrl"
                      >
                        Link video *
                      </label>
                      <input
                        className="p-2 bg-surface-bg rounded-[8px] w-full"
                        value={value.videoUrl}
                        onChange={(e) =>
                          handleSetLesson({
                            fieldName: "videoUrl",
                            index,
                            e,
                            array: lessons,
                            setArray: setLessons,
                          })
                        }
                        type="text"
                        placeholder="https://www.youtube.com/watch?v=GQ-toR8F7rc"
                      />
                      <label
                        className="text-surface-nav text-body-lg font-medium"
                        htmlFor="duration"
                      >
                        Thời lượng *
                      </label>
                      <input
                        className="p-2 bg-surface-bg rounded-[8px] w-full"
                        value={value.duration}
                        onChange={(e) =>
                          handleSetLesson({
                            fieldName: "duration",
                            index,
                            e,
                            array: lessons,
                            setArray: setLessons,
                          })
                        }
                        type="text"
                        placeholder="15:00"
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
          {/* Cài đặt */}
          <div className="border border-surface-bg rounded-[16px] p-4 mt-6">
            <p className="text-title-lg text-surface-nav font-medium">
              Cài đặt
            </p>
            <div className="flex flex-col justify-between gap-y-2 mt-4">
              <label
                className="text-surface-nav text-body-lg font-medium"
                htmlFor="price"
              >
                Giá(VNĐ) *
              </label>
              <input
                type="text"
                className="p-2 bg-surface-bg rounded-[8px] w-full"
                value={courseInfo.price}
                onChange={(e) => {
                  handleSetCourseInfo({ e, setCourseInfo, field: "price" });
                  handleSetError({ setError, field: "errorPrice" });
                }}
                placeholder="199000"
              />
              <span>{error.errorPrice}</span>
              <input
                className="bg-surface-nav text-surface-white  text-title-lg p-2 rounded-[8px] transition-transform duration-300 hover:text-surface-bg hover:cursor-pointer"
                type="submit"
                value="Lưu"
              />
            </div>
          </div>
        </form>
      </div>
    </>
  );
};
export default CourseEditor;
