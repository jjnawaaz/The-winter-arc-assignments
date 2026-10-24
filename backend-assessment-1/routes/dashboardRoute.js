import express from "express";

import { getDashboard } from "../controller/dashboardController.js";
import { authMiddleware } from "../middleware/authMiddleware.js";
const router = express.Router();

/**
 * Dashboard routes
 *
 * GET /dashboard - Retrieve dashboard statistics for the authenticated user
 *
 * @requires authMiddleware - Authenticates the user before accessing dashboard statistics
 * @returns - Total workspaces, total tasks, completed tasks, and pending tasks
 */
router.get("/dashboard", authMiddleware, getDashboard);

export default router;
