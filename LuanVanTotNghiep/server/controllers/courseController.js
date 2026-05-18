import { validateForm } from "../helper/validateForm.js";
import { CategoryService } from "../services/categoryService.js";
import { CourseService } from "../services/courseService.js";
import { LessonService } from "../services/lessonService.js";

export class CourseController {
  addCourse = async (req, res) => {
    try {
      const payload = req.payload;
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
          userId: payload.sub,
          formData,
          image_url,
          thumbnail_url,
        });
        if (lessonArray.length > 0)
          await new LessonService().addLessons({
            lessonArray,
            courseId: result._id,
          });
        return res
          .status(201)
          .json({ message: "Tạo khóa học thành công", data: result });
      }
    } catch (error) {
      const status = error.statusCode || 500;
      return res
        .status(status)
        .json({ message: error.message || "Lỗi hệ thống" });
    }
  };
  getCoursesByInstructor = async (req, res) => {
    try {
      const payload = req.payload;
      const result = await new CourseService().getCoursesByInstructor({
        instructorId: payload.sub,
      });
      return res.status(200).json({ data: result });
    } catch (error) {
      const status = error.statusCode || 500;
      return res
        .status(status)
        .json({ message: error.message || "Lỗi hệ thống" });
    }
  };
  getCourseById = async (req, res) => {
    try {
      const { id } = req.params;
      const result = await new CourseService().getCourseById({ courseId: id });
      return res.status(200).json({ data: result });
    } catch (error) {
      const status = error.statusCode || 500;
      return res
        .status(status)
        .json({ message: error.message || "Lỗi hệ thống" });
    }
  };
  updateCourse = async (req, res) => {
    try {
      const { id } = req.params;
      const formData = req.body;
      const image_url = req?.files?.["image"]?.[0]?.path || formData.image;
      const thumbnail_url =
        req?.files?.["thumbnail"]?.[0]?.path || formData.thumbnail;
      let existingLessons = [];
      let newLessons = [];
      const lessonArray = JSON.parse(formData.lessons);
      lessonArray?.map((value) => {
        if (!value.lessonId)
          newLessons.push({
            lessonName: value.lessonName,
            videoUrl: value.videoUrl,
            duration: value.duration,
          });
        else {
          existingLessons.push({
            lessonId: value.lessonId,
            lessonName: value.lessonName,
            videoUrl: value.videoUrl,
            duration: value.duration,
          });
        }
      });
      const categories = await new CategoryService().getAllCategories();
      const categoryIds = categories?.map((value) => {
        return value._id;
      });
      if (
        validateForm.validateFormCourse({ courseInfo: formData, categoryIds })
      ) {
        await new CourseService().updateCourse({
          courseId: id,
          formData,
          image_url,
          thumbnail_url,
        });
        //TH giảng viên thêm bài học mới
        if (newLessons?.length > 0)
          await new LessonService().addLessons({
            lessonArray: newLessons,
            courseId: id,
          });
        //TH giảng viên sửa bài học cũ
        if (existingLessons?.length > 0)
          await new LessonService().updateLessons({
            lessonArray: existingLessons,
          });
        return res.status(200).json({ message: "Cập nhật thành công" });
      }
    } catch (error) {
      const status = error.statusCode || 500;
      return res
        .status(status)
        .json({ message: error.message || "Lỗi hệ thống" });
    }
  };
  deleteCourse = async (req, res) => {
    try {
      const { id } = req.params;
      await new CourseService().deleteCourse({ courseId: id });
      await new LessonService().deleteLessons({ courseId: id });
      return res.status(200).json({ message: "Xóa thành công" });
    } catch (error) {
      const status = error.statusCode || 500;
      return res
        .status(status)
        .json({ message: error.message || "Lỗi hệ thống" });
    }
  };
}
