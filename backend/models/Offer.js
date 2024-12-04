const mongoose = require("mongoose");

const offerSchema = new mongoose.Schema({
  fromUser: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  toUser: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  exchangeType: {
    type: String,
    enum: ["Item", "Service", "Cash"],
    required: true,
  },
  itemOffered: { type: mongoose.Schema.Types.ObjectId, ref: "Item" },
  serviceOffered: { type: mongoose.Schema.Types.ObjectId, ref: "Service" },
  cashAmount: { type: Number },
  status: {
    type: String,
    enum: ["Pending", "Accepted", "Rejected", "Completed"],
    default: "Pending",
  },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model("Offer", offerSchema);
