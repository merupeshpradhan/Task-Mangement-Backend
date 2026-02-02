import { Router } from "express";
import {
  createTask,
  getAllTasks,
  getMyTasks,
  updateTask,
  deleteTask,
} from "../controller/task.controller.js";
import { authMiddleware } from "../middlewares/auth.middleware.js";
import { adminOnly } from "../middlewares/admin.middleware.js";

const router = Router();

router.use(authMiddleware); // all routes protected

router.get("/my-tasks", getMyTasks); // user/admin sees tasks
router.post("/", adminOnly, createTask); // only admin
router.get("/", adminOnly, getAllTasks); // only admin
router.put("/:id", updateTask); // admin or user
router.delete("/:id", adminOnly, deleteTask); // only admin

export default router;
