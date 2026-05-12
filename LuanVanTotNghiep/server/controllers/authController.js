import dotenv from "dotenv";
dotenv.config();
import passport from "passport";
import { validateForm } from "../helper/validateForm.js";
import { AuthService } from "../services/authService.js";

export class AuthController {
  loginGoogle = passport.authenticate("google", {
    scope: ["profile", "email"],
    prompt: "select_account",
  });

  getGoogleCallback = [
    passport.authenticate("google", {
      failureRedirect: "/login",
      session: false,
    }),
    async (req, res) => {
      const user = req.user;
      const result = await new AuthService().generateToken({ data: user });
      return res.redirect(`${process.env.URL_FRONTEND}?token=${result.token}`);
    },
  ];

  Register = async (req, res) => {
    try {
      const data = req.body;
      if (validateForm.validateFormAuth({ data })) {
        const result = await new AuthService().Register({ data });
        return res
          .status(201)
          .json({ message: "Đăng ký tài khoản thành công", data: result });
      }
    } catch (error) {
      const status = error.statusCode || 500;
      return res
        .status(status)
        .json({ message: error.message || "Lỗi hệ thống!" });
    }
  };

  Login = async (req, res) => {
    try {
      const data = req.body;
      if (validateForm.validateFormAuth({ data })) {
        const result = await new AuthService().Login({ data });
        return res.status(200).json({
          message: "Đăng nhập thành công",
          data: result.data,
          token: result.token,
        });
      }
    } catch (error) {
      const status = error.statusCode || 500;
      return res
        .status(status)
        .json({ message: error.message || "Lỗi hệ thống!" });
    }
  };
}
