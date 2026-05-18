import dotenv from "dotenv";
dotenv.config();
import connectDB from "./configs/database.js";
connectDB();
import "./configs/passport.js";
import express from "express";
import cors from "cors";
const app = express();
const port = 3000;
import { authRouter } from "./routers/authRouter.js";
import { roleRouter } from "./routers/roleRouter.js";
import { userRouter } from "./routers/userRouter.js";
import { categoryRouter } from "./routers/categoryRouter.js";
import { courseRouter } from "./routers/courseRouter.js";
import { lessonRouter } from "./routers/lessonRouter.js";
app.use(
  cors({
    origin: process.env.URL_FRONTEND,
    credentials: true,
  })
);
app.use(express.json());
app.use("/", authRouter);
app.use("/", roleRouter);
app.use("/", userRouter);
app.use("/", categoryRouter);
app.use("/", courseRouter);
app.use("/", lessonRouter);
app.get("/", (req, res) => {
  return res.json("Server is running...");
});
app.listen(port, () => {
  console.log("Server đang chạy với port:" + port);
});
