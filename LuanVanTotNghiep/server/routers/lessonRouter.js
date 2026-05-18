import express from "express";
export const lessonRouter = express.Router();
import { LessonController } from "../controllers/lessonController.js";
const prefix = "";
lessonRouter.get(
  `${prefix}/lessons/:courseId`,
  new LessonController().getLessonsByCourse
);
lessonRouter.delete(
  `${prefix}/lesson/:id`,
  new LessonController().deleteLesson
);
