import mongoose from "mongoose";
import crypto from "crypto";

const userSchema = new mongoose.Schema(
  {
    firstName: { type: String, required: true },
    lastName: { type: String, required: true },
    username: { type: String, required: true, unique: true },
    email: { type: String, required: true, unique: true },
    isEmailVerified: { type: Boolean, default: false },
    verificationToken: { type: String },
    password: { type: String, required: true },
    profileImg: { type: String, default: "default-profile-image.png" },
    coverImg: { type: String, default: "default-cover-image.jpg" },
    bio: {
      type: String,
      default: "I am.. I sell.. I offer.. I am searching for..",
    },
    isAdmin: { type: Boolean, default: false },
    sellerStatus: { type: Boolean, default: false },
    languages: [
      {
        name: { type: String, required: true },
        level: {
          type: String,
          enum: ["beginner", "intermediate", "fluent", "native"],
          required: true,
        },
      },
    ],
    balance: { type: Number, default: 0 },
    balanceHistory: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "BalanceHistory",
      },
    ],
    rating: { type: Number, default: 0 },
    favProviders: [
      {
        _id: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
        type: { type: String, enum: ["item", "service"], required: true },
      },
    ],
    loginAttempts: {
      type: Number,
      default: 0,
    },
    lockUntil: {
      type: Date,
    },
    resetPasswordToken: {
      type: String,
    },
    resetPasswordExpires: {
      type: Date,
    },
  },
  { timestamps: true }
);

userSchema.methods.isLocked = function () {
  return this.lockUntil && this.lockUntil > Date.now();
};

userSchema.methods.incrementLoginAttempts = function () {
  if (this.lockUntil && this.lockUntil < Date.now()) {
    this.loginAttempts = 1;
    this.lockUntil = undefined;
  } else {
    this.loginAttempts += 1;
    if (this.loginAttempts >= 3) {
      this.lockUntil = Date.now() + 5 * 60 * 1000;
    }
  }
  return this.save();
};

userSchema.methods.generatePasswordResetToken = function () {
  const resetToken = crypto.randomBytes(32).toString("hex");

  this.resetPasswordToken = crypto
    .createHash("sha256")
    .update(resetToken)
    .digest("hex");
  this.resetPasswordExpires = Date.now() + 15 * 60 * 1000;

  return resetToken;
};

userSchema.pre("save", function (next) {
  if (this.sellerStatus && (!this.languages || this.languages.length === 0)) {
    return next(new Error("Sellers must have at least one language."));
  }
  next();
});

const User = mongoose.model("User", userSchema);

export default User;
