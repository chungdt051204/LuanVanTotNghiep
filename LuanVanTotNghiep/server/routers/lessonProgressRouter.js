import express from "express";
export const lessonProgressRouter = express.Router();
import { LessonProgressController } from "../controllers/lessonProgressController.js";
import { middleware } from "../middlewares/middleware.js";
const prefix = "";
lessonProgressRouter.get(
  `${prefix}/lessonProgresses`,
  middleware.verifyToken,
  new LessonProgressController().getLessonProgressesByUser
);
lessonProgressRouter.post(
  `${prefix}/lessonProgress`,
  middleware.verifyToken,
  new LessonProgressController().createLessonProgress
);
lessonProgressRouter.put(
  `${prefix}/lessonProgress/:id`,
  middleware.verifyToken,
  new LessonProgressController().updateLessonProgress
);
