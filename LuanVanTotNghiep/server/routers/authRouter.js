import express from "express";
export const authRouter = express.Router();
import { AuthController } from "../controllers/authController.js";
const prefix = "";
authRouter.get(`${prefix}/auth/google`, new AuthController().loginGoogle);
authRouter.get(
  `${prefix}/auth/google/callback`,
  new AuthController().getGoogleCallback
);
authRouter.post(`${prefix}/auth/register`, new AuthController().Register);
authRouter.post(`${prefix}/auth/login`, new AuthController().Login);
