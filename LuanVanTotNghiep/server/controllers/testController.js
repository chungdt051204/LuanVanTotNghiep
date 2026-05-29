import { QuestionService } from "../services/questionService.js";
import { TestService } from "../services/testService.js";

export class TestController {
  getTestsByInstructor = async (req, res) => {
    try {
      const payload = req.payload;
      const result = await new TestService().getTestsByInstructor({
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
  getTestById = async (req, res) => {
    try {
      const { id } = req.params;
      const result = await new TestService().getTestById({ testId: id });
      return res.status(200).json({ data: result });
    } catch (error) {
      const status = error.statusCode || 500;
      return res
        .status(status)
        .json({ message: error.message || "Lỗi hệ thống" });
    }
  };
  createTest = async (req, res) => {
    try {
      const { formData } = req.body;
      const questions = formData?.questions || [];
      const result = await new TestService().createTest({ formData });
      if (questions.length > 0) {
        await new QuestionService().addQuestion({
          testId: result._id,
          questions,
        });
      }
      return res
        .status(200)
        .json({ message: "Tạo bài kiểm tra thành công", data: result });
    } catch (error) {
      const status = error.statusCode || 500;
      return res
        .status(status)
        .json({ message: error.message || "Lỗi hệ thống" });
    }
  };
}
