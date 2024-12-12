import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    firstName: { type: String, required: true },
    lastName: { type: String, required: true },
    username: { type: String, required: true, unique: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    profileImg: { type: String, default: "default-profile-image.png" },
    coverImg: { type: String, default: "default-cover-image.png" },
    bio: {
      type: String,
      default: "I am.. I sell.. I offer.. I am searching for..",
    },
    isAdmin: { type: Boolean, default: false },
    sellerStatus: { type: Boolean, default: false }, // Flag for seller status
    // Referencing Service and Item models
    services: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Service",
      },
    ],
    items: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Item",
      },
    ],
    favProviders: [
      {
        _id: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
        type: { type: String, enum: ["item", "service"], required: true },
      },
    ],
    defaultPaymentMethod: {
      type: String,
      enum: ["PayPal", "Credit Card", "Bank Transfer"],
      default: "PayPal",
    }, // Default payment method
  },
  { timestamps: true }
);

// Middleware for seller validation
userSchema.pre("save", function (next) {
  if (
    !this.sellerStatus &&
    (this.services.length > 0 || this.items.length > 0)
  ) {
    return next(
      new Error(
        "Only users with 'sellerStatus' enabled can offer items or services."
      )
    );
  }

  next();
});

const User = mongoose.model("User", userSchema);

export default User;
