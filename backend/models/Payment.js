const mongoose = require("mongoose");

const paymentSchema = new mongoose.Schema({
  payer: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  payee: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  amount: { type: Number, required: true },
  paymentMethod: { type: String, required: true },
  paymentLink: { type: String }, // For PayPal, Stripe, etc.
  status: {
    type: String,
    enum: ["Pending", "Completed", "Failed"],
    default: "Pending",
  },
  createdAt: { type: Date, default: Date.now },
  completedAt: { type: Date },
  transactionId: { type: String },
});

module.exports = mongoose.model("Payment", paymentSchema);
