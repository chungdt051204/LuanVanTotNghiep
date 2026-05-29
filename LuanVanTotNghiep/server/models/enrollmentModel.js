import mongoose from "mongoose";
const enrollmentSchema = new mongoose.Schema(
  {
    user_id: {
      type: mongoose.Schema.ObjectId,
      ref: "userEntity",
    },
    course_id: {
      type: mongoose.Schema.ObjectId,
      ref: "courseEntity",
    },
    access_level: {
      type: String,
      enum: ["LIMITED", "UNLIMITED"],
      required: true,
    },
    progress_percent: {
      type: Number,
      min: 0,
      default: 0,
    },
  },
  { timestamps: true }
);
export default mongoose.model(
  "enrollmentEntity",
  enrollmentSchema,
  "Enrollment"
);
