import { useState } from "react";
import { useSelector } from "react-redux";
import { courseService } from "../../services/courseService";
import { toast } from "react-toastify";
import { validateForm } from "../../../helper/validateForm";

const AddCourse = () => {
  const categories = useSelector((state) => state.categories.items);
  const levels = ["Cơ bản", "Trung bình", "Nâng cao"];
  const [courseInfo, setCourseInfo] = useState({
    courseName: "",
    description: "",
    category_id: "",
    level: "",
    image: "",
    thumbnail: "",
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
  const handleDeleteItem = ({ index, setArray }) => {
    setArray(
      //Filter cũng giống map có value và index
      objectives.filter((_, i) => i !== index)
    );
  };
  const handleSetLesson = ({ fieldName, index, e, array, setArray }) => {
    const { value } = e.target;
    const newArray = [...array];
    newArray[index][fieldName] = value;
    setArray(newArray);
  };
  const handleSetError = ({ setError, field }) => {
    setError((prev) => ({ ...prev, [field]: "" }));
  };
  const handleAddCourse = async (e) => {
    e.preventDefault();
    console.log(courseInfo.image, courseInfo.thumbnail);
    if (validateForm.validateFormCourse({ courseInfo, setError })) {
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
      try {
        const result = await courseService.addCourse({ data: formData });
        toast.success(result.message || "Tạo khóa học thành công");
      } catch (error) {
        const status = error.status;
        const message = error.data.message;
        if (status === 409)
          setError((prev) => ({ ...prev, errorCourseName: message }));
        console.log(message);
      }
    }
  };

  return (
    <>
      <div>
        <p>Tạo khóa học mới</p>
        <p>Điền thông tin khóa học của bạn</p>
      </div>
      <form onSubmit={handleAddCourse}>
        {/* Thông tin cơ bản */}
        <div className="border p-4">
          <p>Thông tin cơ bản</p>
          <label htmlFor="courseName">Tên khóa học *</label>
          <br />
          <input
            value={courseInfo.courseName}
            onChange={(e) => {
              handleSetCourseInfo({ e, setCourseInfo, field: "courseName" });
              handleSetError({ setError, field: "errorCourseName" });
            }}
            type="text"
            placeholder="React cơ bản và nâng cao"
          />
          <br />
          <span>{error.errorCourseName}</span>
          <br />
          <label htmlFor="description">Mô tả *</label>
          <br />
          <input
            value={courseInfo.description}
            onChange={(e) =>
              handleSetCourseInfo({ e, setCourseInfo, field: "description" })
            }
            type="text"
            placeholder="Mô tả chi tiết về khóa học..."
          />
          <br />
          <div className="flex">
            <div>
              <label htmlFor="category">Danh mục *</label>
              <br />
              <div className="flex flex-col">
                <select
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
              <label htmlFor="level">Cấp độ *</label>
              <br />
              <div className="flex flex-col">
                <select
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
            <br />
          </div>
          <label htmlFor="image">Ảnh khóa học *</label>
          <br />
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
          <br />
          <label htmlFor="thumbnail">Ảnh bìa *</label>
          <br />
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
          <br />
          <span>{error.errorFile}</span>
          <br />
        </div>
        <br />
        {/* Yêu cầu & kết quả đạt được */}
        <div className="flex flex-col gap-y-3 border p-4">
          <p>Yêu cầu & Kết quả đạt được</p>
          <div>
            <p>Yêu cầu trước khi học</p>
            <p>Những kỹ năng cần có trước khi tham gia khóa học</p>
            <div className="flex">
              <input
                value={requirementContent}
                onChange={(e) => setRequirementContent(e.target.value)}
                type="text"
                placeholder="Ví dụ: Hiểu biết cơ bản về HTML, CSS"
              />
              <button
                onClick={() =>
                  handleAddItem({
                    content: requirementContent,
                    setContent: setRequirementContent,
                    setArray: setRequirements,
                  })
                }
                className="border ms-2"
                type="button"
              >
                Thêm
              </button>
            </div>
            <div>
              {requirements.length > 0 ? (
                requirements.map((value, index) => {
                  return (
                    <div className="flex" key={index}>
                      <p>{value}</p>
                      <button
                        onClick={() =>
                          handleDeleteItem({ index, setArray: setRequirements })
                        }
                        className="border ms-2"
                        type="button"
                      >
                        Xóa
                      </button>
                    </div>
                  );
                })
              ) : (
                <p>Chưa có yêu cầu nào</p>
              )}
            </div>
          </div>
          <div>
            <p>Kết quả đạt được sau khóa học</p>
            <p>
              Những kỹ năng hoặc kiến thức mà học viên sẽ có được sau khi hoàn
              thành khóa học
            </p>
            <div className="flex">
              <input
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
                className="border ms-2"
                type="button"
              >
                Thêm
              </button>
            </div>
            <ul>
              {objectives.length > 0 ? (
                objectives.map((value, index) => {
                  return (
                    <div className="flex" key={index}>
                      <p>{value}</p>
                      <button
                        onClick={() =>
                          handleDeleteItem({ index, setArray: setObjectives })
                        }
                        className="border ms-2"
                        type="button"
                      >
                        Xóa
                      </button>
                    </div>
                  );
                })
              ) : (
                <p>Chưa có kết quả đạt được nào</p>
              )}
            </ul>
          </div>
        </div>
        <br />
        {/* Nội dung khóa học */}
        <div className="border p-4">
          <div className="flex">
            <p>Nội dung khóa học</p>
            <button
              type="button"
              onClick={() => {
                setLessons((prev) => [
                  ...prev,
                  { lessonName: "", videoUrl: "", duration: "" },
                ]);
              }}
              className="ms-2 border"
            >
              Thêm bài học
            </button>
          </div>
          <div className="flex flex-col gap-y-3">
            {lessons?.map((value, index) => {
              return (
                <div key={index} className="border">
                  <p>Bài học {index + 1}</p>
                  <label htmlFor="lessonName">Tiêu đề bài học *</label>
                  <br />
                  <input
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
                  <br />
                  <label htmlFor="videoUrl">Link video *</label>
                  <br />
                  <input
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
                  <br />
                  <label htmlFor="duration">Thời lượng *</label>
                  <br />
                  <input
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
              );
            })}
          </div>
        </div>
        <br />
        {/* Cài đặt */}
        <div className="border p-4">
          <p>Cài đặt</p>
          <label htmlFor="price">Giá(VNĐ) *</label>
          <br />
          <input
            value={courseInfo.price}
            onChange={(e) => {
              handleSetCourseInfo({ e, setCourseInfo, field: "price" });
              handleSetError({ setError, field: "errorPrice" });
            }}
            type="text"
            placeholder="199000"
          />
          <br />
          <span>{error.errorPrice}</span>
          <br />
          <input className="border" type="submit" value="Lưu" />
          <br />
          <input className="border" type="button" value="Hủy" />
        </div>
      </form>
    </>
  );
};
export default AddCourse;
