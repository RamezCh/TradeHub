const mongoose = require("mongoose");

const notificationSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    message: { type: String, required: true },
    type: {
      type: String,
      enum: [
        "payment_reminder",
        "system_update",
        "chat_alert",
        "order_complete",
        "dispute",
      ],
      required: true,
    },
    readStatus: { type: Boolean, default: false },
  },
  { timestamps: true }
);

const Notification = mongoose.model("Notification", notificationSchema);
module.exports = Notification;
