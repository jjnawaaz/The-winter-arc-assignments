import express from "express";
import { resolveMarket } from "../controller/resolveController.js";
const router = express.Router();

// protected route
router.post("/resolve", resolveMarket);

export default router;
