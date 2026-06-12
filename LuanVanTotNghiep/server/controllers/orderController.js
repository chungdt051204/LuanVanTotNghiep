import dotenv from "dotenv";
dotenv.config();
import { OrderService } from "../services/orderService.js";

export class OrderController {
  checkout = async (req, res) => {
    try {
      const { formData } = req.body;
      const result = await new OrderService().checkout({
        formData,
      });
      return res.status(200).json({ data: result });
    } catch (error) {
      const status = error.statusCode || 500;
      return res
        .status(status)
        .json({ message: error.message || "Lỗi hệ thống" });
    }
  };
  getResultZaloPayment = async (req, res) => {
    try {
      const params = req.query;
      const result = await new OrderService().getResultZaloPayment({ params });
      console.log(result);
      return res.redirect(
        `${process.env.URL_FRONTEND}/cart?status=${result.status}`
      );
    } catch (error) {
      const status = error.statusCode || 500;
      return res
        .status(status)
        .json({ message: error.message || "Lỗi hệ thống" });
    }
  };
}
