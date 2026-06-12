import orderItemEntity from "../models/orderItemModel.js";
export class OrderItemService {
  addOrderItem = async ({ orderItem, orderId }) => {
    const newOrderItem = await orderItemEntity.create({
      order_id: orderId,
      course_id: orderItem?.courseId,
      course_name: orderItem?.courseName,
      price: orderItem?.price,
      payment_option: orderItem?.paymentOption,
      applied_amount: orderItem?.appliedAmount,
    });
    return newOrderItem;
  };
}
