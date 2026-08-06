import express from "express";
export const authRouter = express.Router();
import { AuthController } from "../controllers/authController.js";
import { middleware } from "../middlewares/middleware.js";
const prefix = "";
authRouter.get(`${prefix}/auth/google`, new AuthController().loginGoogle);
authRouter.get(
  `${prefix}/auth/google/callback`,
  new AuthController().getGoogleCallback
);
authRouter.post(`${prefix}/auth/register`, new AuthController().Register);
authRouter.post(`${prefix}/auth/login`, new AuthController().Login);
authRouter.post(
  `${prefix}/auth/logout`,
  middleware.verifyToken,
  new AuthController().Logout
);
