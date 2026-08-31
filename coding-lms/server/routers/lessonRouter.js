import express from "express";
export const lessonRouter = express.Router();
import { LessonController } from "../controllers/lessonController.js";
import { middleware } from "../middlewares/middleware.js";
const prefix = "";
lessonRouter.get(
  `${prefix}/lessons/:courseId`,
  new LessonController().getLessonsByCourse
);
lessonRouter.get(
  `${prefix}/course/:courseId/lesson/:id`,
  middleware.verifyToken,
  new LessonController().getLessonById
);
lessonRouter.delete(
  `${prefix}/instructor/lesson/:id`,
  middleware.verifyToken,
  middleware.isInstructor,
  new LessonController().deleteLesson
);
