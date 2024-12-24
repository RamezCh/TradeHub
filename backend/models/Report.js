import mongoose from "mongoose";

const reportSchema = new mongoose.Schema(
  {
    reporterId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User", // Reference to the User model
      required: true,
    },
    targetType: {
      type: String,
      enum: ["item", "service", "seller"], // The type of entity being reported
      required: true,
    },
    targetId: {
      type: mongoose.Schema.Types.ObjectId,
      refPath: "targetType", // Dynamically refer to Listing or User
      required: true,
    },
    reason: {
      type: String,
      required: [true, "Reason is required"],
      enum: [
        "Fraud",
        "Inappropriate Content",
        "Spam",
        "Misleading Information",
        "Harassment",
        "Other",
      ],
    },
    additionalDetails: {
      type: String,
      maxlength: [1000, "Additional details cannot exceed 1000 characters"],
    },
    status: {
      type: String,
      enum: ["Pending", "Resolved", "Dismissed"],
      default: "Pending",
    },
    resolution: {
      resolvedBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User", // Reference to an admin user
      },
      notes: {
        type: String,
        maxlength: [1000, "Resolution notes cannot exceed 1000 characters"],
      },
      resolvedAt: {
        type: Date,
      },
    },
  },
  {
    timestamps: true, // Automatically adds createdAt and updatedAt fields
  }
);

const Report = mongoose.model("Report", reportSchema);
export default Report;
