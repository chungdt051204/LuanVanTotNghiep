import cartItemEntity from "../models/cartItemModel.js";
export class CartItemService {
  addCartItem = async ({ cartId, courseId }) => {
    const newCartItem = await cartItemEntity.create({
      cart_id: cartId,
      course_id: courseId,
    });
    await newCartItem.populate("course_id");
    return newCartItem;
  };
  getCartItemsInCart = async ({ cartId }) => {
    const cartItems = await cartItemEntity
      .find({ cart_id: cartId })
      .populate("course_id");
    return cartItems || [];
  };
  deleteCartItem = async ({ cartItemId }) => {
    const cartItem = await cartItemEntity.findOne({ _id: cartItemId });
    if (!cartItem) {
      const error = new Error("Item này không tồn tại trong giỏ hàng!");
      error.statusCode = 404;
      throw error;
    }
    await cartItemEntity.deleteOne({ _id: cartItemId });
  };
  deletedCartItemsSelected = async ({ cartItemIds }) => {
    const cartItemsPromise = cartItemIds?.map(async (value) => {
      await cartItemEntity.deleteOne({ _id: value });
    });
    await Promise.all(cartItemsPromise);
  };
}
