import mongoose from "mongoose";
const questionSchema = new mongoose.Schema(
  {
    test_id: {
      type: mongoose.Schema.ObjectId,
      ref: "testEntity",
    },
    question_content: {
      type: String,
      required: true,
    },
  },
  {
    timestamps: true,
  }
);
export default mongoose.model("questionEntity", questionSchema, "Question");
