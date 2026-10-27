import express from "express";
import { authMiddleware } from "../middleware/auth.js";
import {
  getBets,
  createMarket,
  getMarkets,
  placeBet,
} from "../controller/marketController.js";
const router = express.Router();

// protected route

// markets
router.post("/", authMiddleware, createMarket);
router.get("/", getMarkets);

// bets
router.post("/bet", authMiddleware, placeBet);
router.get("/bets", authMiddleware, getBets);

export default router;
