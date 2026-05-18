import userEntity from "../models/userModel.js";

export class UserService {
  getUserProfile = async ({ payload }) => {
    const me = await userEntity
      .findOne({ _id: payload.sub })
      .populate("role_id");
    if (!me) {
      const error = new Error("Tài khoản không tồn tại hoặc đã bị xóa");
      error.statusCode = 404;
      throw error;
    }
    return me;
  };
}
