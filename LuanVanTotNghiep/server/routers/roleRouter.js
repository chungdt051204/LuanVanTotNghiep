import express from "express";
export const roleRouter = express.Router();
import { RoleController } from "../controllers/roleController.js";
const prefix = "";
roleRouter.get(`${prefix}/roles`, new RoleController().getAllRoles);
