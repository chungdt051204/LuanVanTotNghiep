import { EnrollmentService } from "../services/enrollmentService.js";

export class EnrollmentController {
  createEnrollment = async (req, res) => {
    try {
      const payload = req.payload;
      const { courseId } = req.body;
      const result = await new EnrollmentService().createEnrollment({
        courseId,
        userId: payload.sub,
      });
      return res
        .status(200)
        .json({ message: "Đăng ký học khóa học thành công", data: result });
    } catch (error) {
      const status = error.statusCode || 500;
      return res
        .status(status)
        .json({ message: error.message || "Lỗi hệ thống" });
    }
  };
  getEnrollmentsByUser = async (req, res) => {
    try {
      const payload = req.payload;
      const result = await new EnrollmentService().getEnrollmentsByUser({
        userId: payload.sub,
      });
      return res.status(200).json({ data: result });
    } catch (error) {
      const status = error.statusCode || 500;
      return res
        .status(status)
        .json({ message: error.message || "Lỗi hệ thống" });
    }
  };
  getAllEnrollments = async (req, res) => {
    try {
      const result = await new EnrollmentService().getAllEnrollments();
      return res.status(200).json({ data: result });
    } catch (error) {
      const status = error.statusCode || 500;
      return res
        .status(status)
        .json({ message: error.message || "Lỗi hệ thống" });
    }
  };
}
