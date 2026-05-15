import mongoose from "mongoose";
const courseSchema = new mongoose.Schema(
  {
    user_id: {
      type: mongoose.Schema.ObjectId,
      ref: "userEntity",
    },
    category_id: {
      type: mongoose.Schema.ObjectId,
      ref: "categoryEntity",
    },
    course_name: {
      type: String,
      required: true,
      unique: true,
    },
    description: {
      type: String,
    },
    level: {
      type: String,
      enum: ["Cơ bản", "Trung bình", "Nâng cao"],
      required: true,
    },
    requirements: {
      type: [String],
      default: [],
    },
    objectives: {
      type: [String],
      default: [],
    },
    price: {
      type: Number,
      min: 0,
      required: true,
    },
    image_url: {
      type: String,
      required: true,
    },
    thumbnail_url: {
      type: String,
      required: true,
    },
    is_free: {
      type: Boolean,
      default: 0,
    },
    status: {
      type: String,
      enum: ["Bản nháp", "Chờ duyệt", "Đã đăng tải", "Bị từ chối"],
      default: "Bản nháp",
    },
  },
  {
    timestamps: true,
  }
);
export default mongoose.model("courseEntity", courseSchema, "Course");
