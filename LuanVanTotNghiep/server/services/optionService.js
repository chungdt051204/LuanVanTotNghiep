import optionEntity from "../models/optionModel.js";
export class OptionService {
  getOptionsByQuestion = async ({ questionId }) => {
    const options = await optionEntity.find({ question_id: questionId });
    return options || [];
  };
  addOption = async ({ questionId, options }) => {
    const optionPromise = options?.map((value) => {
      return optionEntity.create({
        question_id: questionId,
        answer_content: value.optionContent,
        is_correct: value.isCorrect,
      });
    });
    await Promise.all(optionPromise);
  };
}
