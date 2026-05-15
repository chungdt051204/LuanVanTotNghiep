import dotenv from "dotenv";
dotenv.config();
import jsonwebtoken from "jsonwebtoken";
import userEntity from "../models/userModel.js";

export class UserService {
  getUserProfile = async ({ data }) => {
    const token = data.slice(7);
    try {
      const decoded = jsonwebtoken.verify(token, process.env.JWT_SECRET);
      const me = await userEntity
        .findOne({ _id: decoded.sub })
        .populate("role_id");
      if (!me) {
        const error = new Error("Tài khoản không tồn tại hoặc đã bị xóa");
        error.statusCode = 401;
        throw error;
      }
      return me;
    } catch (error) {
      //Lỗi do hàm verify trả về(thường là lỗi token hết hạn)
      if (error.name === "TokenExpiredError") {
        const error = new Error(
          "Phiên đăng nhập đã hết hạn, vui lòng đăng nhập lại!"
        );
        error.statusCode = 401;
        throw error;
      }
    }
  };
}
