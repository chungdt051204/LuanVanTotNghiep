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
const prefix = "";
courseRouter.post(
  `${prefix}/course`,
  upload.fields([
    { name: "image", maxCount: 1 },
    { name: "thumbnail", maxCount: 1 },
  ]),
  new CourseController().addCourse
);
