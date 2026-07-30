import { validateForm } from "../helper/validateForm.js";
import { UserService } from "../services/userService.js";

export class UserController {
  getUserProfile = async (req, res) => {
    try {
      const payload = req.payload;
      const result = await new UserService().getUserProfile({
        payload,
      });
      return res.status(200).json({ data: result });
    } catch (error) {
      const status = error.statusCode || 500;
      return res
        .status(status)
        .json({ message: error.message || "Lỗi hệ thống!" });
    }
  };
  getInstructors = async (req, res) => {
    try {
      const params = req.query;
      const result = await new UserService().getInstructors({ params });
      return res.status(200).json({ data: result });
    } catch (error) {
      const status = error.statusCode || 500;
      return res
        .status(status)
        .json({ message: error.message || "Lỗi hệ thống!" });
    }
  };
  getUsers = async (req, res) => {
    try {
      const params = req.query;
      const result = await new UserService().getUsers({ params });
      return res.status(200).json({ data: result });
    } catch (error) {
      const status = error.statusCode || 500;
      return res
        .status(status)
        .json({ message: error.message || "Lỗi hệ thống!" });
    }
  };
  getInstructorById = async (req, res) => {
    try {
      const { id } = req.params;
      const result = await new UserService().getInstructorById({
        instructorId: id,
      });
      return res.status(200).json({ data: result });
    } catch (error) {
      const status = error.statusCode || 500;
      return res
        .status(status)
        .json({ message: error.message || "Lỗi hệ thống!" });
    }
  };
  getUserById = async (req, res) => {
    try {
      const { id } = req.params;
      const result = await new UserService().getUserById({
        userId: id,
      });
      return res.status(200).json({ data: result });
    } catch (error) {
      const status = error.statusCode || 500;
      return res
        .status(status)
        .json({ message: error.message || "Lỗi hệ thống!" });
    }
  };
  getStudentsByInstructor = async (req, res) => {
    try {
      const payload = req.payload;
      const params = req.query;
      const result = await new UserService().getStudentsByInstructor({
        instructorId: payload.sub,
        params,
      });
      return res.status(200).json({ data: result });
    } catch (error) {
      const status = error.statusCode || 500;
      return res
        .status(status)
        .json({ message: error.message || "Lỗi hệ thống!" });
    }
  };
  getStudentById = async (req, res) => {
    try {
      const payload = req.payload;
      const { id } = req.params;
      const params = req.query;
      const result = await new UserService().getStudentById({
        studentId: id,
        instructorId: payload.sub,
        params,
      });
      return res.status(200).json({ data: result });
    } catch (error) {
      const status = error.statusCode || 500;
      return res
        .status(status)
        .json({ message: error.message || "Lỗi hệ thống!" });
    }
  };
  updateProfile = async (req, res) => {
    try {
      const payload = req.payload;
      const formData = req.body;
      console.log(formData);
      const avatar = req?.file?.path || formData.avatar;
      if (validateForm.validateUserForm({ formData })) {
        const result = await new UserService().updateProfile({
          userId: payload.sub,
          formData,
          avatar,
        });
        return res.status(200).json({
          message: "Cập nhật thông tin tài khoản thành công",
          data: result,
        });
      }
    } catch (error) {
      const status = error.statusCode || 500;
      return res
        .status(status)
        .json({ message: error.message || "Lỗi hệ thống!" });
    }
  };
  updateStatusUser = async (req, res) => {
    try {
      const { id } = req.params;
      const result = await new UserService().updateStatusUser({ userId: id });
      return res.status(200).json({
        message: result?.status
          ? "Kích hoạt tài khoản thành công"
          : "Vô hiệu hóa tài khoản thành công",
        data: result,
      });
    } catch (error) {
      const status = error.statusCode || 500;
      return res
        .status(status)
        .json({ message: error.message || "Lỗi hệ thống!" });
    }
  };
  updateInstructorInfo = async (req, res) => {
    try {
      const { id } = req.params;
      const { formData } = req.body;
      if (
        validateForm.validateUserForm({
          formData,
        })
      ) {
        const result = await new UserService().updateInstructorInfo({
          instructorId: id,
          formData,
        });
        return res.status(200).json({
          message: "Cập nhật thông tin giảng viên thành công",
          data: result,
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
