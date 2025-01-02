import mongoose from "mongoose";

const auditSchema = new mongoose.Schema(
  {
    action: {
      type: String,
      enum: [
        "Created",
        "Resolved",
        "Dismissed",
        "Deleted",
        "Edited",
        "Reviewed",
        "Logged In",
        "Logged Out",
        "Verified",
      ],
      required: true,
    },
    targetType: {
      type: String,
      enum: ["listing", "user", "category", "location", "review", "offer"],
      required: true,
    },
    targetId: {
      type: mongoose.Schema.Types.ObjectId,
      refPath: "targetType",
      required: true,
    },
    performedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    details: {
      type: String,
      maxlength: [1000, "Details cannot exceed 1000 characters"],
    },
    timestamp: {
      type: Date,
      default: Date.now,
    },
  },
  { timestamps: true }
);

const Audit = mongoose.model("Audit", auditSchema);
export default Audit;
