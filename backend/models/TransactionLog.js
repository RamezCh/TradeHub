const mongoose = require("mongoose");

const transactionLogSchema = new mongoose.Schema(
  {
    offer: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Offer",
      required: true,
    },
    action: {
      type: String,
      enum: ["created", "paid", "completed", "cancelled"],
      required: true,
    },
    status: { type: String, enum: ["success", "failure"], required: true },
    description: { type: String },
  },
  { timestamps: true }
);

const TransactionLog = mongoose.model("TransactionLog", transactionLogSchema);
module.exports = TransactionLog;
