import testEntity from "../models/testModel.js";
import { CourseService } from "../services/courseService.js";

export class TestService {
  getTestsByInstructor = async ({ instructorId }) => {
    const courses = await new CourseService().getCoursesByInstructor({
      instructorId,
    });
    const courseIds =
      courses?.map((value) => {
        return value._id;
      }) || [];
    const tests = await testEntity
      .find({ course_id: { $in: courseIds } })
      .populate("course_id");
    return tests || [];
  };
  getTestById = async ({ testId }) => {
    const test = await testEntity.findOne({ _id: testId });
    if (!test) {
      const error = new Error("Không tìm thấy bài kiểm tra này!");
      error.statusCode = 404;
      throw error;
    }
    return test;
  };
  createTest = async ({ formData }) => {
    const test = await testEntity.findOne({ course_id: formData.courseId });
    if (test) {
      const error = new Error(
        "Khóa học này đã có bài kiểm tra, không thể tạo thêm!"
      );
      error.statusCode = 409;
      throw error;
    }
    const newTest = await testEntity.create({
      test_name: formData.testName,
      course_id: formData.courseId,
      duration_minutes: formData.durationMinutes,
      pass_score: formData.passScore,
    });
    return newTest;
  };
}
