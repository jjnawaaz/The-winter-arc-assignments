import express from "express";
import { authMiddleware } from "../middleware/authMiddleware.js";
import {
  createTask,
  deleteTask,
  getTasks,
  patchTask,
} from "../controller/taskController.js";

const router = express.Router();

/**
 * Task routes
 *
 * POST   /create      - Create a new task
 * GET    /task        - Retrieve tasks with pagination and search
 * PATCH  /task/:taskId - Update a task completion status
 * DELETE /task/:taskId - Delete a task
 *
 * @requires authMiddleware - Authenticates users before accessing task routes
 */
router.post("/create", authMiddleware, createTask);
router.get("/task", authMiddleware, getTasks);
router.patch("/task/:id", authMiddleware, patchTask);
router.delete("/task/:id", authMiddleware, deleteTask);

export default router;
