const mongoose = require("mongoose");

const auditTrailSchema = new mongoose.Schema(
  {
    action: {
      type: String,
      enum: [
        "Create",
        "Update",
        "Delete",
        "Accept",
        "Reject",
        "Complete",
        "Dispute",
      ],
      required: true,
    },
    performedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    target: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      refPath: "targetModel",
    },
    targetModel: {
      type: String,
      enum: ["Listing", "Offer", "Payment"],
      required: true,
    },
    description: { type: String }, // Detailed description of the action
    timestamp: { type: Date, default: Date.now },
  },
  { timestamps: true }
);

module.exports = mongoose.model("AuditTrail", auditTrailSchema);
