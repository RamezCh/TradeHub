const mongoose = require("mongoose");

const itemSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    description: { type: String },
    category: { type: String, required: true },
    condition: { type: String, enum: ["New", "Used"], required: true },
    owner: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    images: [{ type: String }], // URLs
  },
  { timestamps: true } // Enables createdAt and updatedAt
);

module.exports = mongoose.model("Item", itemSchema);
