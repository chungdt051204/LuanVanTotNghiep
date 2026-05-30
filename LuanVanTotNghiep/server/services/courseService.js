import courseEntity from "../models/courseModel.js";
import enrollmentEntity from "../models/enrollmentModel.js";
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
  getApprovedCourses = async () => {
    const courses = await courseEntity
      .find({ status: "approved" })
      .populate("category_id")
      .populate("user_id");
    return courses || [];
  };
  getCoursesByInstructor = async ({ instructorId }) => {
    const courses = await courseEntity
      .find({ user_id: instructorId })
      .populate("category_id");
    const arrayCourse = await Promise.all(
      courses?.map(async (value) => {
        const numberEnrollment = await enrollmentEntity.countDocuments({
          course_id: value._id,
        });
        return { course: value, numberEnrollment };
      })
    );
    return arrayCourse || [];
  };
  getCoursesByAdmin = async () => {
    const arrayStatus = ["pending", "approved", "rejected"];
    const courses = await courseEntity
      .find({ status: { $in: arrayStatus } })
      .populate("category_id")
      .populate("user_id");
    return courses || [];
  };
  getCourseById = async ({ courseId }) => {
    const course = await courseEntity
      .findOne({ _id: courseId })
      .populate("category_id")
      .populate("user_id");
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
    const result = await courseEntity
      .findOneAndUpdate(
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
      )
      .populate("category_id");
    return result;
  };
  deleteCourse = async ({ courseId }) => {
    const result = await courseEntity.findOneAndDelete({ _id: courseId });
    if (!result) {
      const error = new Error("Không tìm thấy khóa học để xóa!");
      error.statusCode = 404;
      throw error;
    }
    return result;
  };
  submitOrUnSubmitCourse = async ({ courseId, status }) => {
    const allowedStatus = ["pending", "draft"];
    if (!allowedStatus.includes(status)) {
      const error = new Error(
        "Không thể thiết lập trạng thái này cho khóa học!"
      );
      error.statusCode = 400;
      throw error;
    }
    const course = await courseEntity.findOne({ _id: courseId });
    if (!course) {
      const error = new Error(
        "Không tìm thấy khóa học để cập nhật trạng thái!"
      );
      error.statusCode = 404;
      throw error;
    }
    if (course.status !== "approved") {
      const result = await courseEntity
        .findOneAndUpdate(
          { _id: courseId },
          { status },
          { returnDocument: "after" }
        )
        .populate("category_id");
      const numberEnrollment = await enrollmentEntity.countDocuments({
        course_id: result,
      });
      return { course: result, numberEnrollment };
    } else {
      const error = new Error(
        "Khóa học đã được đăng tải, không thể thay đổi trạng thái!"
      );
      error.statusCode = 400;
      throw error;
    }
  };
  approveOrRejectCourse = async ({ courseId, status }) => {
    const allowedStatus = ["approved", "rejected"];
    if (!allowedStatus.includes(status)) {
      const error = new Error(
        "Không thể thiết lập trạng thái này cho khóa học!"
      );
      error.statusCode = 400;
      throw error;
    }
    const course = await courseEntity.findOne({ _id: courseId });
    if (!course) {
      const error = new Error(
        "Không tìm thấy khóa học để cập nhật trạng thái!"
      );
      error.statusCode = 404;
      throw error;
    }
    if (course.status === "pending") {
      const result = await courseEntity
        .findOneAndUpdate(
          { _id: courseId },
          { status },
          { returnDocument: "after" }
        )
        .populate("category_id")
        .populate("user_id");
      return result;
    } else {
      const error = new Error("không thể thay đổi trạng thái của khóa học!");
      error.statusCode = 400;
      throw error;
    }
  };
  deleteOrRestoreCourse = async ({ courseId, action }) => {
    const allowedStatus = ["draft", "rejected"];
    const allowedActions = ["delete", "restore"];
    const course = await courseEntity.findOne({ _id: courseId });
    if (!course) {
      const error = new Error(
        "Không tìm thấy khóa học để thực hiện hành động này!"
      );
      error.statusCode = 404;
      throw error;
    }
    if (!allowedStatus.includes(course.status)) {
      const error = new Error("không thể xóa khóa học này khi đã đăng tải!");
      error.statusCode = 400;
      throw error;
    }
    if (!allowedActions.includes(action)) {
      const error = new Error("không thể thực hiện hành động này!");
      error.statusCode = 400;
      throw error;
    }
    const result = await courseEntity
      .findOneAndUpdate(
        { _id: courseId },
        { is_visible: action === "delete" ? false : true },
        { returnDocument: "after" }
      )
      .populate("category_id");
    const numberEnrollment = await enrollmentEntity.countDocuments({
      course_id: result,
    });
    return { course: result, numberEnrollment };
  };
}
