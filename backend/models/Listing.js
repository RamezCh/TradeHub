const mongoose = require("mongoose");

const listingSchema = new mongoose.Schema(
  {
    item: { type: mongoose.Schema.Types.ObjectId, ref: "Item", required: true },
    expectedExchange: {
      type: String,
      enum: ["Cash", "Service", "Item"],
      required: true,
    },
    acceptsAlternatives: { type: Boolean, default: false }, // Accept services/items
    isActive: { type: Boolean, default: true },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Listing", listingSchema);
