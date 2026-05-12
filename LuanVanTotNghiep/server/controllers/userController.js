import { UserService } from "../services/userService.js";

export class UserController {
  getUserProfile = async (req, res) => {
    try {
      const result = await new UserService().getUserProfile({
        data: req.headers.authorization,
      });
      return res.status(200).json({ data: result });
    } catch (error) {
      const status = error.statusCode || 500;
      return res
        .status(status)
        .json({ message: error.message || "Lỗi hệ thống!" });
    }
  };
}
