import testEntity from "../models/testModel.js";
import questionEntity from "../models/questionModel.js";
import { CourseService } from "../services/courseService.js";
import { QuestionService } from "./questionService.js";
import { OptionService } from "./optionService.js";

export class TestService {
  getTestsByInstructor = async ({ instructorId }) => {
    const courses = await new CourseService().getCoursesByInstructor({
      instructorId,
    });
    const courseIds =
      courses?.map((value) => {
        return value.course._id;
      }) || [];
    const tests = await testEntity
      .find({ course_id: { $in: courseIds } })
      .populate("course_id");
    const arrayTest = await Promise.all(
      tests?.map(async (value) => {
        const numberQuestion = await questionEntity.countDocuments({
          test_id: value._id,
        });
        return { test: value, numberQuestion };
      })
    );
    return arrayTest || [];
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
  deleteTest = async ({ testId }) => {
    const test = await testEntity.findOne({ _id: testId });
    if (!test) {
      const error = new Error("Không tìm thấy bài kiểm tra để xóa!");
      error.statusCode = 404;
      throw error;
    }
    const questions = await questionEntity.find({ test_id: testId });
    await testEntity.deleteOne({ _id: testId });
    await new QuestionService().deleteQuestions({ testId });
    await new OptionService().deleteOptions({ questions });
  };
  updateTest = async ({ testId, formData }) => {
    const test = await testEntity.findOne({ _id: testId });
    if (!test) {
      const error = new Error(
        "Không tìm thấy bài kiểm tra để chỉnh sửa thông tin!"
      );
      error.statusCode = 404;
      throw error;
    }
    const result = await testEntity
      .findOneAndUpdate(
        { _id: testId },
        {
          course_id: formData.courseId,
          test_name: formData.testName,
          duration_minutes: formData.durationMinutes,
          pass_score: formData.passScore,
        },
        {
          returnDocument: "after",
        }
      )
      .populate("course_id");
    const numberQuestion = await questionEntity.countDocuments({
      test_id: result._id,
    });
    return { test: result, numberQuestion };
  };
}
