import express from "express";
export const questionRouter = express.Router();
import { QuestionController } from "../controllers/questionController.js";
const prefix = "";
questionRouter.get(
  `${prefix}/test/:testId/questions`,
  new QuestionController().getQuestionsByTest
);
