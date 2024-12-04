const mongoose = require("mongoose");

const serviceSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String },
  owner: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  price: { type: Number }, // Optional if offered for free or exchange
  createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model("Service", serviceSchema);
