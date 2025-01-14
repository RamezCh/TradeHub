import mongoose from "mongoose";
import crypto from "crypto";

const offerSchema = new mongoose.Schema(
  {
    listingId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Listing",
      required: true,
    },
    sender: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    receiver: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    type: {
      type: String,
      enum: ["item", "service", "cash", "mixed"],
      required: true,
    },
    details: { type: String },
    status: {
      type: String,
      enum: ["pending", "accepted", "rejected", "cancelled", "completed"],
      default: "pending",
    },

    senderConfirmation: {
      code: { type: String },
      confirmed: { type: Boolean, default: false },
    },
    receiverConfirmation: {
      code: { type: String },
      confirmed: { type: Boolean, default: false },
    },
  },
  { timestamps: true }
);

const generateSecureCode = () => {
  return crypto.randomBytes(16).toString("hex");
};

offerSchema.pre("save", function (next) {
  if (this.isModified("status") && this.status === "accepted") {
    this.senderConfirmation.code = generateSecureCode();
    this.receiverConfirmation.code = generateSecureCode();
  }
  next();
});

offerSchema.pre("save", function (next) {
  if (
    this.senderConfirmation.confirmed &&
    this.receiverConfirmation.confirmed &&
    this.status !== "completed"
  ) {
    this.status = "completed";
  }
  next();
});

const Offer = mongoose.model("Offer", offerSchema);
export default Offer;
