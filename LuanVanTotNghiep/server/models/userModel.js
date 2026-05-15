import mongoose from "mongoose";
const userSchema = new mongoose.Schema(
  {
    full_name: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    phone: {
      type: String,
    },
    password: {
      type: String,
    },
    avatar: {
      type: String,
      default:
        "https://static.vecteezy.com/system/resources/previews/019/879/186/non_2x/user-icon-on-transparent-background-free-png.png",
    },
    role_id: {
      type: mongoose.Schema.ObjectId,
      ref: "roleEntity",
    },
    login_method: {
      type: String,
      enum: ["email thường", "google"],
      default: "email thường",
    },
    status: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
  }
);
export default mongoose.model("userEntity", userSchema, "User");
