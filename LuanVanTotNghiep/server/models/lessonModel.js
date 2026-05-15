import mongoose from "mongoose";
const lessonSchema = new mongoose.Schema(
  {
    course_id: {
      type: mongoose.Schema.ObjectId,
      ref: "courseEntity",
    },
    lesson_name: {
      type: String,
      required: true,
    },
    video_url: {
      type: String,
      required: true,
    },
    duration: {
      type: String,
      required: true,
    },
  },
  {
    timestamps: true,
  }
);
export default mongoose.model("lessonEntity", lessonSchema, "Lesson");
