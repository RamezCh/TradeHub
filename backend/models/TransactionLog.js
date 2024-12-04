const mongoose = require("mongoose");

const transactionLogSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  offer: { type: mongoose.Schema.Types.ObjectId, ref: "Offer", required: true },
  payment: { type: mongoose.Schema.Types.ObjectId, ref: "Payment" },
  type: { type: String, enum: ["Offer", "Payment"], required: true },
  status: { type: String, required: true },
  createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model("TransactionLog", transactionLogSchema);
