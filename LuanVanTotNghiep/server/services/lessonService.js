import lessonEntity from "../models/lessonModel.js";
export class LessonService {
  addLessons = async ({ lessonArray, course_id }) => {
    const lessonPromise = lessonArray?.map((value) => {
      return lessonEntity.create({
        course_id,
        lesson_name: value.lessonName,
        video_url: value.videoUrl,
        duration: value.duration,
      });
    });
    await Promise.all(lessonPromise);
  };
}
