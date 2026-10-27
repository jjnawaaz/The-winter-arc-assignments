import express from "express";
import { authMiddleware } from "../middleware/auth.js";
import {
  getProfile,
  getTransactions,
  onramp,
  signin,
  signup,
} from "../controller/authController.js";

const router = express.Router();

// signin
router.post("/signup", signup);
router.post("/signin", signin);

// protected route
router.post("/onramp", authMiddleware, onramp);
router.get("profile", authMiddleware, getProfile);
router.get("transactions", authMiddleware, getTransactions);

export default router;
