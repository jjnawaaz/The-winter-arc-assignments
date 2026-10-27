import mongoose from "mongoose";

const betSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "USER",
    required: true,
  },
  marketId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "MARKET",
    required: true,
  },
  betAmount: {
    type: Number,
    required: true,
  },
});

export const BET = mongoose.model("BET", betSchema);
