import testResultEntity from "../models/testResultModel.js";
import testEntity from "../models/testModel.js";
import enrollmentEntity from "../models/enrollmentModel.js";
import questionEntity from "../models/questionModel.js";
export class TestResultService {
  getTestResultById = async ({ testResultId }) => {
    const testResult = await testResultEntity
      .findOne({ _id: testResultId })
      .populate("test_id");
    if (!testResultId) {
      const error = new Error("Không tìm thấy kết quả bài kiểm tra!");
      error.statusCode = 404;
      throw error;
    }
    const numberQuestion = await questionEntity.countDocuments({
      test_id: testResult?.test_id,
    });
    return { item: testResult, numberQuestion };
  };
  getTestResultsByTest = async ({ testId, userId }) => {
    const test = await testEntity.findOne({ _id: testId });
    if (!test) {
      const error = new Error("Không tìm thấy bài kiểm tra này!");
      error.statusCode = 404;
      throw error;
    }
    const testResults = await testResultEntity
      .find({ test_id: testId, user_id: userId })
      .populate("test_id");
    return testResults || [];
  };
  createTestResult = async ({ data, userId }) => {
    const newTestResult = await testResultEntity.create({
      test_id: data.testId,
      user_id: userId,
      started_at: data.startedAt,
      submitted_at: data.submittedAt,
      number_answer_correct: data.numberAnswerCorrect,
      score: data.score,
    });
    await newTestResult.populate("test_id");
    if (newTestResult.score >= newTestResult?.test_id?.pass_score) {
      const enrollment = await enrollmentEntity.findOne({
        course_id: newTestResult?.test_id?.course_id,
        user_id: userId,
      });
      if (!enrollment) {
        const error = new Error(
          "Không tìm thấy đơn ghi danh khóa học của người dùng này!"
        );
        error.statusCode = 404;
        throw error;
      }
      const newProgress = enrollment.progress_percent + 40;
      await enrollmentEntity.updateOne(
        {
          course_id: newTestResult?.test_id?.course_id,
          user_id: userId,
        },
        { progress_percent: newProgress }
      );
    }
    return newTestResult;
  };
}
