import mongoose from "mongoose";

const notificationSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    message: { type: String, required: true },
    type: {
      type: String,
      enum: [
        "payment_reminder",
        "pending_offer",
        "maintenance",
        "new_message",
        "order_complete",
      ],
      required: true,
    },
    link: { type: String, required: true },
    readStatus: { type: Boolean, default: false },
  },
  { timestamps: true }
);

const Notification = mongoose.model("Notification", notificationSchema);
export default Notification;
