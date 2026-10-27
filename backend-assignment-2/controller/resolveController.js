import { USER } from "../model/userModel.js";
import { MARKET } from "../model/marketModel.js";
import { BET } from "../model/betModel.js";
import { WALLETEVENT } from "../model/walletEventModel.js";

import { resolveMarketSchema } from "../types/resolveTypes.js";

export async function resolveMarket(req, res) {
  try {
    const { marketId, resolution } = resolveMarketSchema.parse(req.body);

    const market = await MARKET.findOne({
      _id: marketId,
    });

    if (!market) {
      return res.status(404).json({
        error: "Market not found",
      });
    }

    // Only creator will resolve this
    if (market.creatorId.toString() !== req.userId) {
      return res.status(403).json({
        error: "Only creator can resolve",
      });
    }

    if (market.resolution !== null) {
      return res.status(400).json({
        error: "Market already resolved",
      });
    }

    const bets = await BET.find({
      marketId,
    });

    const totalBets = bets.reduce((sum, bet) => sum + bet.betAmount, 0);

    if (market.side === resolution) {
      // creator wins
      const payout = totalBets * 2 + (market.initialWager - totalBets);

      await USER.updateOne(
        { _id: market.creatorId },
        { $inc: { balance: payout } },
      );

      await WALLETEVENT.create({
        userId: market.creatorId,
        tx_type: "payout",
        externalId: { marketId },
        amount: payout,
      });
    } else {
      // People win
      for (const bet of bets) {
        const payout = bet.betAmount * 2;

        await USER.updateOne(
          { _id: bet.userId },
          { $inc: { balance: payout } },
        );

        await WALLETEVENT.create({
          userId: bet.userId,
          tx_type: "payout",
          externalId: {
            marketId,
            betId: bet._id,
          },
          amount: payout,
        });
      }

      // Refund the balance from amount from initial wager and bets
      const refund = market.initialWager - totalBets;

      if (refund > 0) {
        await USER.updateOne(
          { _id: market.creatorId },
          { $inc: { balance: refund } },
        );

        await WALLETEVENT.create({
          userId: market.creatorId,
          tx_type: "refund",
          externalId: { marketId },
          amount: refund,
        });
      }
    }

    market.resolution = resolution;
    await market.save();

    return res.json({
      message: "Market resolved successfully",
      resolution,
    });
  } catch (error) {
    return res.status(400).json({
      error: error.message,
    });
  }
}
