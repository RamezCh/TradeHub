const mongoose = require("mongoose");

const offerSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    itemOffered: { type: mongoose.Schema.Types.ObjectId, ref: "Item" },
    serviceOffered: { type: mongoose.Schema.Types.ObjectId, ref: "Service" },
    cashOffered: { type: Number, default: 0 },
    counterOffer: { type: mongoose.Schema.Types.ObjectId, ref: "Offer" }, // Link to counteroffer
    offerValidity: { type: Date, required: true }, // Expiry of the offer
    status: {
      type: String,
      enum: ["pending", "accepted", "rejected"],
      default: "pending",
    },
  },
  { timestamps: true }
);

const Offer = mongoose.model("Offer", offerSchema);
module.exports = Offer;
