import enrollmentEntity from "../models/enrollmentModel.js";
import courseEntity from "../models/courseModel.js";
import lessonEntity from "../models/lessonModel.js";
export class EnrollmentService {
  createEnrollment = async ({ courseId, userId, accessLevel }) => {
    const course = await courseEntity.findOne({ _id: courseId });
    if (!course) {
      const error = new Error("Khóa học này không tồn tại!");
      error.statusCode = 404;
      throw error;
    }
    const totalLessons = await lessonEntity.countDocuments({
      course_id: courseId,
    });
    const newEnrollment = await enrollmentEntity.create({
      user_id: userId,
      course_id: courseId,
      access_level: accessLevel,
      total_lessons: totalLessons,
    });
    await newEnrollment.populate("course_id");
    return newEnrollment;
  };
  getEnrollmentsByUser = async ({ userId }) => {
    const enrollments = await enrollmentEntity
      .find({ user_id: userId })
      .populate("course_id");
    return enrollments || [];
  };
  getEnrollmentByUserAndCourse = async ({ courseId, userId }) => {
    const enrollment = await enrollmentEntity.findOne({
      course_id: courseId,
      user_id: userId,
    });
    if (!enrollment) {
      const error = new Error("Không tìm thấy kết quả!");
      error.statusCode = 404;
      throw error;
    }
    return enrollment;
  };
  getAllEnrollments = async () => {
    const enrollments = await enrollmentEntity.find();
    return enrollments || [];
  };
  updateEnrollment = async ({ enrollmentId, progressPercent }) => {
    const enrollment = await enrollmentEntity.findOne({ _id: enrollmentId });
    if (!enrollment) {
      const error = new Error("Dữ liệu không tồn tại!");
      error.statusCode = 404;
      throw error;
    }
    await enrollmentEntity.updateOne(
      { _id: enrollmentId },
      { $inc: { completed_lessons: 1 }, progress_percent: progressPercent }
    );
  };
}
