import { validateForm } from "../helper/validateForm.js";
import { CategoryService } from "../services/categoryService.js";
import { CourseService } from "../services/courseService.js";
import { LessonService } from "../services/lessonService.js";

export class CourseController {
  addCourse = async (req, res) => {
    try {
      const image_url = req?.files["image"][0]?.path;
      const thumbnail_url = req?.files["thumbnail"][0]?.path;
      const formData = req.body;
      console.log(formData);
      //Vì req.body.lessons là chuỗi nên phải dùng JSON.parse để biến chuỗi thành mảng
      const lessonArray =
        typeof formData.lessons === "string"
          ? JSON.parse(formData.lessons)
          : formData.lessons;
      console.log(lessonArray);
      const categories = await new CategoryService().getAllCategories();
      const categoryIds = categories?.map((value) => {
        return value._id;
      });
      if (
        validateForm.validateFormCourse({ courseInfo: formData, categoryIds })
      ) {
        const result = await new CourseService().addCourse({
          formData,
          image_url,
          thumbnail_url,
        });
        if (lessonArray.length > 0)
          await new LessonService().addLessons({
            lessonArray,
            course_id: result._id,
          });
        return res
          .status(200)
          .json({ message: "Tạo khóa học thành công", data: result });
      }
    } catch (error) {
      const status = error.statusCode || 500;
      return res
        .status(status)
        .json({ message: error.message || "Lỗi hệ thống" });
    }
  };
}
