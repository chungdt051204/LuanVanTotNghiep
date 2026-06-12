import { CartItemService } from "../services/cartItemService.js";

export class CartItemController {
  deleteCartItem = async (req, res) => {
    try {
      const { id } = req.params;
      const result = await new CartItemService().deleteCartItem({
        cartItemId: id,
      });
      return res
        .status(200)
        .json({ message: "Xóa khóa học ra khỏi giỏ hàng thành công" });
    } catch (error) {
      const status = error.statusCode || 500;
      return res
        .status(status)
        .json({ message: error.message || "Lỗi hệ thống" });
    }
  };
  deleteCartItemsSelected = async (req, res) => {
    try {
      const { cartItemIds } = req.query;
      const arrayCartItemId = cartItemIds.split(","); //Biến chuỗi thành mảng
      console.log(arrayCartItemId);
      await new CartItemService().deletedCartItemsSelected({
        cartItemIds: arrayCartItemId,
      });
      return res.status(200).json({
        message: `Đã xóa ${arrayCartItemId?.length} khóa học ra khỏi giỏ hàng thành công`,
      });
    } catch (error) {
      const status = error.statusCode || 500;
      return res
        .status(status)
        .json({ message: error.message || "Lỗi hệ thống" });
    }
  };
}
