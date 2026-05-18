import lessonEntity from "../models/lessonModel.js";
export class LessonService {
  addLessons = async ({ lessonArray, courseId }) => {
    const lessonPromise = lessonArray?.map((value) => {
      return lessonEntity.create({
        course_id: courseId,
        lesson_name: value.lessonName,
        video_url: value.videoUrl,
        duration: value.duration,
      });
    });
    await Promise.all(lessonPromise);
  };
  getLessonsByCourse = async ({ courseId }) => {
    const lessons = await lessonEntity.find({ course_id: courseId });
    return lessons || [];
  };
  updateLessons = async ({ lessonArray }) => {
    const lessonPromise = lessonArray.map((value) => {
      return lessonEntity.updateOne(
        { _id: value.lessonId },
        {
          lesson_name: value.lessonName,
          video_url: value.videoUrl,
          duration: value.duration,
        }
      );
    });
    await Promise.all(lessonPromise);
  };
  deleteLessons = async ({ courseId }) => {
    await lessonEntity.deleteMany({ course_id: courseId });
  };
  deleteLesson = async ({ lessonId }) => {
    const result = await lessonEntity.deleteOne({ _id: lessonId });
    if (result.deletedCount === 0) {
      const error = new Error("Không tìm thấy bài học để xóa");
      error.statusCode = 404;
      throw error;
    }
  };
}
