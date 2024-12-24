import mongoose from "mongoose";

const balanceHistorySchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    change: { type: Number, required: true },
    balanceAfterChange: { type: Number, required: true },
    reason: { type: String, required: true }, // e.g., "deposit", "purchase", etc.
    timestamp: { type: Date, default: Date.now },
  },
  { timestamps: true }
);

const BalanceHistory = mongoose.model("BalanceHistory", balanceHistorySchema);

export default BalanceHistory;
