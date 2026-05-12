import dotenv from "dotenv";
dotenv.config();
import jsonwebtoken from "jsonwebtoken";
import bcrypt from "bcrypt";
import userEntity from "../models/userModel.js";
const saltRounds = 10;

export class AuthService {
  generateToken = ({ data }) => {
    let result = {};
    const payload = {
      sub: data._id,
    };
    const token = jsonwebtoken.sign(payload, process.env.JWT_SECRET, {
      expiresIn: "1h",
    });
    result.data = data;
    result.token = token;
    return result;
  };

  Register = async ({ data }) => {
    const existingEmail = await userEntity.findOne({
      email: data.email,
      login_method: "email thường",
    });
    if (existingEmail) {
      const error = new Error("Email này đã tồn tại!");
      error.statusCode = 409;
      throw error;
    }
    const hashedPassword = await bcrypt.hash(data.password, saltRounds);
    const newUser = await userEntity.create({
      full_name: data.fullName,
      email: data.email,
      password: hashedPassword,
      role: data.role,
    });
    return newUser;
  };

  Login = async ({ data }) => {
    const existingUser = await userEntity.findOne({
      email: data.email,
      login_method: "email thường",
    });
    if (!existingUser) {
      const error = new Error("Tài khoản không tồn tại hoặc đã bị xóa!");
      error.statusCode = 404;
      throw error;
    }
    const isMatch = await bcrypt.compare(data.password, existingUser.password);
    if (!isMatch) {
      const error = new Error("Mật khẩu không chính xác!");
      error.statusCode = 401;
      throw error;
    }
    return this.generateToken({ data: existingUser });
  };
}
