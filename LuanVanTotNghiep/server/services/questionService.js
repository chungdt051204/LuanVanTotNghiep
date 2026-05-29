import questionEntity from "../models/questionModel.js";
import testEntity from "../models/testModel.js";
import { OptionService } from "./optionService.js";
export class QuestionService {
  getQuestionsByTest = async ({ testId }) => {
    let arrayQuestions = [];
    const test = await testEntity.findOne({ _id: testId });
    if (!test) {
      const error = new Error("Bài kiểm tra không tồn tại!");
      error.statusCode = 404;
      throw error;
    }
    const questions = await questionEntity.find({ test_id: testId });
    const questionPromise = questions?.map(async (value) => {
      const options = await new OptionService().getOptionsByQuestion({
        questionId: value._id,
      });
      return arrayQuestions.push({
        question: value,
        options: options,
      });
    });
    await Promise.all(questionPromise);
    return arrayQuestions;
  };
  addQuestion = async ({ testId, questions }) => {
    const questionPromise = questions?.map(async (value) => {
      const newQuestion = await questionEntity.create({
        test_id: testId,
        question_content: value.questionContent,
      });
      await new OptionService().addOption({
        questionId: newQuestion._id,
        options: value.options,
      });
    });
    await Promise.all(questionPromise);
  };
}
