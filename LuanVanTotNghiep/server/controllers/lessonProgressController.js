import { LessonProgressService } from "../services/lessonProgressService.js";

export class LessonProgressController {
  getLessonProgressesByUser = async (req, res) => {
    try {
      const payload = req.payload;
      const result =
        await new LessonProgressService().getLessonProgressesByUser({
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
  createLessonProgress = async (req, res) => {
    try {
      const payload = req.payload;
      const { lessonId } = req.body;
      const result = await new LessonProgressService().createLessonProgress({
        lessonId,
        userId: payload.sub,
      });
      return res
        .status(200)
        .json({ message: "Tạo tiến độ bài học thành công", data: result });
    } catch (error) {
      const status = error.statusCode || 500;
      return res
        .status(status)
        .json({ message: error.message || "Lỗi hệ thống" });
    }
  };
  updateLessonProgress = async (req, res) => {
    try {
      const payload = req.payload;
      const { id } = req.params;
      const { currentTime } = req.body;
      const result = await new LessonProgressService().updateLessonProgress({
        lessonId: id,
        userId: payload.sub,
        currentTime,
      });
      return res.status(200).json({
        message: "Cập nhật tiến độ bài học thành công",
        data: result,
      });
    } catch (error) {
      const status = error.statusCode || 500;
      return res
        .status(status)
        .json({ message: error.message || "Lỗi hệ thống" });
    }
  };
}
