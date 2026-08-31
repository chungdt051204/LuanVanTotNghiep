import express from "express";
export const questionRouter = express.Router();
import { QuestionController } from "../controllers/questionController.js";
import { middleware } from "../middlewares/middleware.js";
const prefix = "";
questionRouter.get(
  `${prefix}/test/:testId/questions`,
  new QuestionController().getQuestionsByTest
);
questionRouter.delete(
  `${prefix}/instructor/question/:id`,
  middleware.verifyToken,
  middleware.isInstructor,
  new QuestionController().deleteQuestion
);
