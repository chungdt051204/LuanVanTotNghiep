import express from "express";
export const orderRouter = express.Router();
import { OrderController } from "../controllers/orderController.js";
const prefix = "";
import { middleware } from "../middlewares/middleware.js";
orderRouter.post(
  `${prefix}/checkout`,
  middleware.verifyToken,
  new OrderController().checkout
);
orderRouter.get(
  `${prefix}/payment/zalopay/result`,
  new OrderController().getResultZaloPayment
);
