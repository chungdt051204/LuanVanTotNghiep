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
import { enrollmentRouter } from "./routers/enrollmentRouter.js";
import { lessonProgressRouter } from "./routers/lessonProgressRouter.js";
import { testRouter } from "./routers/testRouter.js";
import { questionRouter } from "./routers/questionRouter.js";
import { cartRouter } from "./routers/cartRouter.js";
import { cartItemRouter } from "./routers/cartItemRouter.js";
import { orderRouter } from "./routers/orderRouter.js";
import { notificationRouter } from "./routers/notificationRouter.js";
import { testResultRouter } from "./routers/testResultRouter.js";
import { ratingRouter } from "./routers/ratingRouter.js";
app.use(
  cors({
    origin: process.env.URL_FRONTEND,
    credentials: true,
  })
);
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use("/", authRouter);
app.use("/", roleRouter);
app.use("/", userRouter);
app.use("/", categoryRouter);
app.use("/", courseRouter);
app.use("/", lessonRouter);
app.use("/", enrollmentRouter);
app.use("/", lessonProgressRouter);
app.use("/", testRouter);
app.use("/", questionRouter);
app.use("/", cartRouter);
app.use("/", cartItemRouter);
app.use("/", orderRouter);
app.use("/", notificationRouter);
app.use("/", testResultRouter);
app.use("/", ratingRouter);
app.get("/", (req, res) => {
  return res.json("Server is running...");
});
app.listen(port, () => {
  console.log("Server đang chạy với port:" + port);
});
