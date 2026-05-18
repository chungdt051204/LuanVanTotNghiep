import courseEntity from "../models/courseModel.js";
export class CourseService {
  addCourse = async ({ userId, formData, image_url, thumbnail_url }) => {
    const existingCourse = await courseEntity.findOne({
      course_name: formData.courseName,
    });
    if (existingCourse) {
      const error = new Error("Khóa học này đã tồn tại");
      error.statusCode = 409;
      throw error;
    }
    const course = await courseEntity.create({
      user_id: userId,
      course_name: formData.courseName,
      description: formData.description,
      category_id: formData.category_id,
      level: formData.level,
      requirements: formData.requirements,
      objectives: formData.objectives,
      price: formData.price,
      image_url: image_url,
      thumbnail_url: thumbnail_url,
      is_free: formData.price == 0 ? true : false,
    });
    return course;
  };
  getCoursesByInstructor = async ({ instructorId }) => {
    const courses = await courseEntity
      .find({ user_id: instructorId })
      .populate("category_id");
    return courses || [];
  };
  getCourseById = async ({ courseId }) => {
    const course = await courseEntity.findOne({ _id: courseId });
    if (!course) {
      const error = new Error("Không tìm thấy khóa học này!");
      error.statusCode = 404;
      throw error;
    }
    return course;
  };
  updateCourse = async ({ courseId, formData, image_url, thumbnail_url }) => {
    const course = await courseEntity.findOne({ _id: courseId });
    if (!course) {
      const error = new Error("Không tìm thấy khóa học này!");
      error.statusCode = 404;
      throw error;
    }
    await courseEntity.updateOne(
      { _id: courseId },
      {
        course_name: formData.courseName,
        description: formData.description,
        category_id: formData.category_id,
        level: formData.level,
        image_url: image_url == null ? course.image_url : image_url,
        thumbnail_url:
          thumbnail_url == null ? course.thumbnail_url : thumbnail_url,
        requirements: formData.requirements,
        objectives: formData.objectives,
        price: formData.price,
        is_free: formData.price == 0 ? true : false,
      }
    );
  };
  deleteCourse = async ({ courseId }) => {
    const result = await courseEntity.deleteOne({ _id: courseId });
    if (result.deletedCount === 0) {
      const error = new Error("Không tìm thấy khóa học để xóa!");
      error.statusCode = 404;
      throw error;
    }
  };
}
