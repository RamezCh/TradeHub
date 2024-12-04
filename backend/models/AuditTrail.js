const mongoose = require("mongoose");

const auditTrailSchema = new mongoose.Schema(
  {
    action: { type: String, required: true },
    module: {
      type: String,
      enum: ["Offer", "Payment", "User", "Transaction"],
      required: true,
    },
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    ipAddress: { type: String, required: true },
    description: { type: String },
  },
  { timestamps: true }
);

const AuditTrail = mongoose.model("AuditTrail", auditTrailSchema);
module.exports = AuditTrail;
