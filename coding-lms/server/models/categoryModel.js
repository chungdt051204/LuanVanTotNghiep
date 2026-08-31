import mongoose from "mongoose";
const categorySchema = new mongoose.Schema({
  category_name: {
    type: String,
    required: true,
    unique: true,
  },
});
export default mongoose.model("categoryEntity", categorySchema, "Category");
