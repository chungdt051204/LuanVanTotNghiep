import express from "express";
export const cartRouter = express.Router();
import { CartController } from "../controllers/cartController.js";
import { middleware } from "../middlewares/middleware.js";
const prefix = "";
cartRouter.post(
  `${prefix}/cart`,
  middleware.verifyToken,
  new CartController().addToCart
);
cartRouter.get(
  `${prefix}/cart`,
  middleware.verifyToken,
  new CartController().getMyCart
);
