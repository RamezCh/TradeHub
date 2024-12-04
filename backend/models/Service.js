const mongoose = require("mongoose");

const serviceSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    description: { type: String, required: true },
    category: {
      type: String,
      enum: [
        "Programming",
        "Design",
        "Marketing",
        "Coaching",
        "Building",
        "Others",
      ],
      required: true,
    },
    price: { type: Number, required: true },
    images: [{ type: String }],
    visibilityStatus: {
      type: String,
      enum: ["active", "inactive", "completed"],
      default: "active",
    },
  },
  { timestamps: true }
);

const Service = mongoose.model("Service", serviceSchema);
module.exports = Service;
