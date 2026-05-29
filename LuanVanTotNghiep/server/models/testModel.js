import mongoose from "mongoose";
const testSchema = new mongoose.Schema(
  {
    course_id: {
      type: mongoose.Schema.ObjectId,
      ref: "courseEntity",
    },
    test_name: {
      type: String,
      required: true,
    },
    duration_minutes: {
      type: Number,
      enum: [15, 20, 30, 45, 60],
      required: true,
    },
    pass_score: {
      type: Number,
      enum: [50, 60, 70, 80, 90],
      required: true,
    },
    status: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  }
);
export default mongoose.model("testEntity", testSchema, "Test");
