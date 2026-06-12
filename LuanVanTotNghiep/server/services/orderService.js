import dotenv from "dotenv";
dotenv.config();
import orderEntity from "../models/orderModel.js";
import orderItemEntity from "../models/orderItemModel.js";
import { OrderItemService } from "../services/orderItemService.js";
import { CartItemService } from "../services/cartItemService.js";
import { EnrollmentService } from "../services/enrollmentService.js";
import axios from "axios";
import CryptoJS from "crypto-js";
import moment from "moment";
import { NotificationService } from "./notificationService.js";

const config = {
  appid: process.env.APP_ID,
  key1: process.env.KEY1,
  key2: process.env.KEY2,
  endpoint: process.env.ENDPOINT,
};
export class OrderService {
  checkout = async ({ formData, userId }) => {
    const newOrder = await this.createOrder({ formData });
    const orderItemsPromise = formData.orderItems?.map(async (value) => {
      return await new OrderItemService().addOrderItem({
        orderItem: value,
        orderId: newOrder._id,
      });
    });
    await Promise.all(orderItemsPromise);
    const appTransId = moment().format("YYMMDD") + "_" + Date.now(); //ZaloPay yêu cầu yyMMdd_
    const embedData = {
      redirecturl: `${process.env.URL_BACKEND}/payment/zalopay/result`,
    };
    const items = formData.orderItems?.map((value) => {
      return { id: value.courseId };
    });
    const orderData = {
      app_id: config.appid,
      app_user: userId,
      app_time: Date.now(),
      amount: newOrder.total_amount,
      app_trans_id: appTransId,
      embed_data: JSON.stringify(embedData),
      item: JSON.stringify(items),
      description: `Thanh toan don hang ${newOrder._id}`,
    };
    const data =
      orderData.app_id +
      "|" +
      orderData.app_trans_id +
      "|" +
      orderData.app_user +
      "|" +
      orderData.amount +
      "|" +
      orderData.app_time +
      "|" +
      orderData.embed_data +
      "|" +
      orderData.item; //Thứ tự appId, appTransId, appUser, amount, appTime, embedData, item
    orderData.mac = CryptoJS.HmacSHA256(data, config.key1).toString();
    const response = await axios.post(
      config.endpoint,
      new URLSearchParams(orderData).toString(),
      {
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
        },
      }
    );
    await orderEntity.updateOne(
      { _id: newOrder?._id },
      { transaction_id: appTransId }
    );
    return response.data;
  };
  createOrder = async ({ formData }) => {
    const newOrder = await orderEntity.create({
      user_id: formData.userId,
      full_name: formData.fullName,
      email: formData.email,
      cart_item_ids: formData.cartItemIds,
      payment_method: formData.paymentMethod,
      total_amount: formData.totalAmount,
      transaction_id: null,
    });
    return newOrder;
  };
  getResultZaloPayment = async ({ params }) => {
    //Tạo chuỗi băm
    let data =
      params.appid +
      "|" +
      params.apptransid +
      "|" +
      params.pmcid +
      "|" +
      params.bankcode +
      "|" +
      params.amount +
      "|" +
      params.discountamount +
      "|" +
      params.status;
    let checksum = CryptoJS.HmacSHA256(data, config.key2).toString(); //Tạo chuỗi mã hóa
    console.log(checksum, params.checksum, checksum === params.checksum);
    //Kiểm tra xem checksum vừa tạo có bằng checksum zalopay gửi về
    if (checksum !== params.checksum) {
      const error = new Error("Xác thực thất bại!");
      error.statusCode = 401;
      throw error;
    }
    const order = await orderEntity.findOne({
      transaction_id: params.apptransid,
    });
    if (!order) {
      const error = new Error("Đơn hàng không tồn tại!");
      error.statusCode = 404;
      throw error;
    }
    const notificationService = new NotificationService();
    if (params.status != 1) {
      await orderEntity.updateOne(
        { _id: order._id },
        { payment_status: "FAILED" }
      );
      await notificationService.createNotification({
        userId: order.user_id,
        type: "PAYMENT",
        title: "Thanh toán thất bại",
        message: `Thanh toán cho đơn hàng ${order._id} không thành công`,
      });
      return { status: "failed" };
    }
    const orderItems = await orderItemEntity.find({ order_id: order?._id });
    const paymentStatus = orderItems?.some(
      (value) => value.payment_option == "PARTIAL"
    )
      ? "PARTIAL_PAID"
      : "PAID";
    await orderEntity.updateOne(
      { transaction_id: params.apptransid },
      { payment_status: paymentStatus }
    );
    await new CartItemService().deletedCartItemsSelected({
      cartItemIds: order?.cart_item_ids,
    });
    await notificationService.createNotification({
      userId: order.user_id,
      type: "PAYMENT",
      title: "Thanh toán thành công",
      message: `Đơn hàng ${order._id} đã được thanh toán thành công`,
    });
    const enrollmentService = new EnrollmentService();
    await Promise.all(
      orderItems?.map(async (value) => {
        const accessLevel =
          value.price > value.applied_amount ? "LIMITED" : "UNLIMITED";
        await enrollmentService.createEnrollment({
          courseId: value.course_id,
          userId: order.user_id,
          accessLevel,
        });
        await notificationService.createNotification({
          userId: order.user_id,
          type: "ENROLLMENT",
          title: "Đăng ký khóa học thành công",
          message: `Khóa học ${value.course_name} đã được đăng ký thành công`,
        });
      })
    );
    return { status: "success" };
  };
}
