import courseEntity from "../models/courseModel.js";
export class CourseService {
  addCourse = async ({ formData, image_url, thumbnail_url }) => {
    const existingCourse = await courseEntity.findOne({
      course_name: formData.courseName,
    });
    if (existingCourse) {
      const error = new Error("Khóa học này đã tồn tại");
      error.statusCode = 409;
      throw error;
    }
    const course = await courseEntity.create({
      course_name: formData.courseName,
      description: formData.description,
      category_id: formData.category_id,
      level: formData.level,
      requirements: formData.requirements,
      objectives: formData.objectives,
      price: formData.price,
      image_url: image_url,
      thumbnail_url: thumbnail_url,
    });
    return course;
  };
}
