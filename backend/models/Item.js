const mongoose = require("mongoose");

const itemSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    description: { type: String, required: true },
    category: {
      type: String,
      enum: [
        "Electronics",
        "Clothing",
        "Furniture",
        "Sport",
        "Beauty",
        "Toys",
        "Video Games",
        "Books",
      ],
      required: true,
    },
    price: { type: Number, required: true },
    images: [{ type: String }],
    visibilityStatus: {
      type: String,
      enum: ["active", "inactive", "sold"],
      default: "active",
    },
  },
  { timestamps: true }
);

const Item = mongoose.model("Item", itemSchema);
module.exports = Item;
