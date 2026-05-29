import dotenv from "dotenv";
dotenv.config();
import jsonwebtoken from "jsonwebtoken";
import { RoleService } from "../services/roleService.js";
import userEntity from "../models/userModel.js";
export const middleware = {
  verifyToken: async (req, res, next) => {
    try {
      let token = req.headers.authorization;
      if (!token) return res.status(401).json({ message: "Unauthorized" });
      token = token.slice(7);
      const decoded = jsonwebtoken.verify(token, process.env.JWT_SECRET);
      req.payload = decoded;
      return next();
    } catch (error) {
      if (error.name == "TokenExpiredError")
        return res.status(403).json({ message: "Phiên đăng nhập đã hết hạn!" });
    }
  },
  isAdmin: async (req, res, next) => {
    const payload = req.payload;
    const roleAdmin = await new RoleService().getRoleByName({
      name: "admin",
    });
    const user = await userEntity.findOne({ _id: payload.sub });
    if (user.role_id.toString() !== roleAdmin._id.toString())
      //Đổi thành String cho dễ so sánh
      return res.status(403).json({
        message: "Bạn không có quyền thực hiện hành động này!",
      });
    return next();
  },
  isInstructor: async (req, res, next) => {
    const payload = req.payload;
    const roleInstructor = await new RoleService().getRoleByName({
      name: "instructor",
    });
    const user = await userEntity.findOne({ _id: payload.sub });
    if (user.role_id.toString() !== roleInstructor._id.toString())
      return res.status(403).json({
        message: "Bạn không có quyền thực hiện hành động này!",
      });
    return next();
  },
};
