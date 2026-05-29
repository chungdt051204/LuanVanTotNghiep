import enrollmentEntity from "../models/enrollmentModel.js";
import courseEntity from "../models/courseModel.js";
export class EnrollmentService {
  createEnrollment = async ({ courseId, userId }) => {
    const course = await courseEntity.findOne({ _id: courseId });
    if (!course) {
      const error = new Error("Khóa học này không tồn tại!");
      error.statusCode = 404;
      throw error;
    }
    const newEnrollment = await enrollmentEntity.create({
      user_id: userId,
      course_id: courseId,
      access_level: "UNLIMITED",
    });
    return newEnrollment;
  };
  getEnrollmentsByUser = async ({ userId }) => {
    const enrollments = await enrollmentEntity.find({ user_id: userId });
    return enrollments || [];
  };
  getAllEnrollments = async () => {
    const enrollments = await enrollmentEntity.find();
    return enrollments || [];
  };
}
