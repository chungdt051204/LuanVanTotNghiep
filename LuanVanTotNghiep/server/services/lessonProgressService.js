import lessonProgressEntity from "../models/lessonProgressModel.js";
import lessonEntity from "../models/lessonModel.js";
export class LessonProgressService {
  getLessonProgressesByUser = async ({ userId }) => {
    const lessonProgresses = await lessonProgressEntity
      .find({
        user_id: userId,
      })
      .populate("lesson_id");
    return lessonProgresses || [];
  };
  createLessonProgress = async ({ lessonId, userId }) => {
    const lesson = await lessonEntity.findOne({ _id: lessonId });
    if (!lesson) {
      const error = new Error("Bài học này không tồn tại!");
      error.statusCode = 404;
      throw error;
    }
    const newLessonProgress = await lessonProgressEntity.create({
      lesson_id: lessonId,
      user_id: userId,
    });
    return newLessonProgress;
  };
  updateLessonProgress = async ({ lessonId, userId, currentTime }) => {
    const lesson = await lessonEntity.findOne({ _id: lessonId });
    if (!lesson) {
      const error = new Error("Bài học này không tồn tại!");
      error.statusCode = 404;
      throw error;
    }
    const result = await lessonProgressEntity
      .findOneAndUpdate(
        {
          lesson_id: lessonId,
          user_id: userId,
        },
        {
          current_time: currentTime,
          is_completed: currentTime / lesson.duration >= 0.95,
        },
        { returnDocument: "after" }
      )
      .populate("lesson_id");
    return result;
  };
}
