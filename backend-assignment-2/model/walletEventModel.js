import mongoose from "mongoose";

const walletEventSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "USER",
    required: true,
  },
  tx_type: {
    type: String,
    enum: ["onramp", "created", "bet", "payout", "refund"],
    required: true,
  },
  externalId: {
    type: mongoose.Schema.Types.Mixed,
  },
  amount: {
    type: Number,
    required: true,
  },
});

export const WALLETEVENT = mongoose.model("WALLETEVENT", walletEventSchema);
