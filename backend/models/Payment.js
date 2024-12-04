const mongoose = require("mongoose");

const paymentSchema = new mongoose.Schema({
  payer: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  payee: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  offer: { type: mongoose.Schema.Types.ObjectId, ref: "Offer", required: true },
  amount: { type: Number, required: true },
  paymentMethod: {
    type: String,
    enum: ["PayPal", "CreditCard", "Other"],
    required: true,
  },
  paymentLink: { type: String }, // Link to initiate payment
  status: {
    type: String,
    enum: ["Pending", "Completed", "Failed"],
    default: "Pending",
  },
  createdAt: { type: Date, default: Date.now },
  completedAt: { type: Date },
  transactionId: { type: String }, // Transaction ID from the payment gateway
});

module.exports = mongoose.model("Payment", paymentSchema);
