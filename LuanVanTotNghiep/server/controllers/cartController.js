import { CartService } from "../services/cartService.js";

export class CartController {
  addToCart = async (req, res) => {
    try {
      const payload = req.payload;
      const { courseId } = req.body;
      const result = await new CartService().addToCart({
        userId: payload.sub,
        courseId,
      });
      return res.status(201).json({
        message: "Thêm khóa học vào giỏ hàng thành công",
        data: result,
      });
    } catch (error) {
      const status = error.statusCode || 500;
      return res
        .status(status)
        .json({ message: error.message || "Lỗi hệ thống" });
    }
  };
  getMyCart = async (req, res) => {
    try {
      const payload = req.payload;
      const result = await new CartService().getMyCart({ userId: payload.sub });
      return res.status(200).json({ data: result });
    } catch (error) {
      const status = error.statusCode || 500;
      return res
        .status(status)
        .json({ message: error.message || "Lỗi hệ thống" });
    }
  };
}
