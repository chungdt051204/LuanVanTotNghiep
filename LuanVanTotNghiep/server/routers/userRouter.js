import express from "express";
export const userRouter = express.Router();
import { UserController } from "../controllers/userController.js";
import { middleware } from "../middlewares/middleware.js";
const prefix = "";
userRouter.get(
  `${prefix}/me`,
  middleware.verifyToken,
  new UserController().getUserProfile
);
