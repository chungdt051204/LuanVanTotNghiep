import { QuestionService } from "../services/questionService.js";

export class QuestionController {
  getQuestionsByTest = async (req, res) => {
    try {
      const { testId } = req.params;
      const result = await new QuestionService().getQuestionsByTest({ testId });
      return res.status(200).json({ data: result });
    } catch (error) {
      const status = error.statusCode || 500;
      return res
        .status(status)
        .json({ message: error.message || "Lỗi hệ thống" });
    }
  };
  deleteQuestion = async (req, res) => {
    try {
      const { id } = req.params;
      const result = await new QuestionService().deleteQuestion({
        questionId: id,
      });
      return res.status(200).json({ message: "Xóa câu hỏi thành công" });
    } catch (error) {
      const status = error.statusCode || 500;
      return res
        .status(status)
        .json({ message: error.message || "Lỗi hệ thống" });
    }
  };
}
