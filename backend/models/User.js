const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
  {
    username: { type: String, required: true, unique: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    profileImage: { type: String, default: "default-profile-image.png" },
    bio: { type: String, default: "" },
    preferences: {
      searchFilter: {
        category: { type: String, enum: ["Item", "Service"], default: "Item" },
        priceRange: { type: [Number], default: [0, 1000] },
        location: { type: String, default: "" },
        rating: { type: Number, min: 1, max: 5, default: 0 },
      },
    },
    isAdmin: { type: Boolean, default: false },
    sellerStatus: { type: Boolean, default: false }, // Become a seller flag
    myList: [
      {
        providerId: { type: mongoose.Schema.Types.ObjectId, ref: "User" }, // Reference to other users' profiles
        type: { type: String, enum: ["Item", "Service"], required: true }, // Type of provider (Item/Service)
      },
    ],
    referralCode: { type: String, unique: true }, // Referral code for friend referral system
    referredBy: { type: mongoose.Schema.Types.ObjectId, ref: "User" }, // Reference to the user who referred
    defaultPaymentMethod: {
      type: String,
      enum: ["PayPal", "Credit Card", "Bank Transfer"],
      default: "PayPal",
    }, // Default payment method
  },
  { timestamps: true }
);

const User = mongoose.model("User", userSchema);
module.exports = User;
