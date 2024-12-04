const disputeSchema = new mongoose.Schema(
  {
    relatedOffer: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Offer",
      required: true,
    },
    raisedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    against: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    description: { type: String, required: true }, // Details of the dispute
    status: {
      type: String,
      enum: ["Open", "Resolved", "Rejected"],
      default: "Open",
    },
    resolutionDetails: { type: String }, // Admin-provided resolution summary
    admin: { type: mongoose.Schema.Types.ObjectId, ref: "User" }, // Admin handling the dispute
    createdAt: { type: Date, default: Date.now },
    resolvedAt: { type: Date },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Dispute", disputeSchema);
