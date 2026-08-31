import express from "express";
export const categoryRouter = express.Router();
import { CategoryController } from "../controllers/categoryController.js";
const prefix = "";
categoryRouter.get(
  `${prefix}/categories`,
  new CategoryController().getAllCategories
);
