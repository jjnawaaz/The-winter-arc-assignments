import express from "express";
import {
  createWorkSpace,
  deleteWorkSpaces,
  getAllWorkSpaces,
} from "../controller/workspaceController.js";
import { authMiddleware } from "../middleware/authMiddleware.js";
const router = express.Router();

/**
 * Workspace routes
 *
 * POST   /create                - Create a new workspace
 * GET    /get-all-workspaces    - Retrieve the authenticated user's workspaces
 * DELETE /delete-workspace/:id  - Delete a workspace owned by the authenticated user
 *
 * @requires authMiddleware - Authenticates users before accessing workspace routes
 */
router.post("/create", authMiddleware, createWorkSpace);
router.get("/get-all-workspaces", authMiddleware, getAllWorkSpaces);
router.delete("/delete-workspace/:id", authMiddleware, deleteWorkSpaces);

export default router;
