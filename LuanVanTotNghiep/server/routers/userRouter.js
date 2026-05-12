import express from "express";
export const userRouter = express.Router();
import { UserController } from "../controllers/userController.js";
const prefix = "";
userRouter.get(`${prefix}/me`, new UserController().getUserProfile);
