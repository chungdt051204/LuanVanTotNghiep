import cartEntity from "../models/cartModel.js";
import cartItemEntity from "../models/cartItemModel.js";
import courseEntity from "../models/courseModel.js";
import { CartItemService } from "./cartItemService.js";
export class CartService {
  addToCart = async ({ userId, courseId }) => {
    const course = await courseEntity.findOne({ _id: courseId });
    if (!course) {
      const error = new Error("Khóa học này không tồn tại");
      error.statusCode = 404;
      throw error;
    }
    const cart = await cartEntity.findOne({ user_id: userId });
    if (!cart) {
      const newCart = await cartEntity.create({ user_id: userId });
      const newCartItem = await new CartItemService().addCartItem({
        cartId: newCart._id,
        courseId,
      });
      return newCartItem;
    } else {
      const existingCartItem = await cartItemEntity.findOne({
        cart_id: cart._id,
        course_id: courseId,
      });
      if (!existingCartItem) {
        const newCartItem = await new CartItemService().addCartItem({
          cartId: cart._id,
          courseId,
        });
        return newCartItem;
      }
    }
  };
  getMyCart = async ({ userId }) => {
    const cart = await cartEntity.findOne({ user_id: userId });
    if (!cart) {
      const error = new Error("Không tìm thấy giỏ hàng của người dùng!");
      error.statusCode = 404;
      throw error;
    }
    const cartItems = await new CartItemService().getCartItemsInCart({
      cartId: cart._id,
    });
    return cartItems;
  };
}
