import express from "express";
import cloudinary from "../configs/cloudinary.js";
import { CloudinaryStorage } from "multer-storage-cloudinary";
import multer from "multer";
const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: "Course",
    allowed_formats: ["jpg", "png", "jpeg"],
  },
});
const upload = multer({ storage: storage });
export const courseRouter = express.Router();
import { CourseController } from "../controllers/courseController.js";
import { middleware } from "../middlewares/middleware.js";
const prefix = "";
courseRouter.get(
  `${prefix}/instructor/courses`,
  middleware.verifyToken,
  middleware.isInstructor,
  new CourseController().getCoursesByInstructor
);
courseRouter.get(`${prefix}/course/:id`, new CourseController().getCourseById);
courseRouter.post(
  `${prefix}/course`,
  middleware.verifyToken,
  middleware.isInstructor,
  upload.fields([
    { name: "image", maxCount: 1 },
    { name: "thumbnail", maxCount: 1 },
  ]),
  new CourseController().addCourse
);
courseRouter.put(
  `${prefix}/course/:id`,
  middleware.verifyToken,
  middleware.isInstructor,
  upload.fields([
    { name: "image", maxCount: 1 },
    { name: "thumbnail", maxCount: 1 },
  ]),
  new CourseController().updateCourse
);
courseRouter.delete(
  `${prefix}/course/:id`,
  middleware.verifyToken,
  middleware.isInstructor,
  new CourseController().deleteCourse
);
