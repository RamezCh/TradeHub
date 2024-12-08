import mongoose from "mongoose";

const listingSchema = new mongoose.Schema(
  {
    ownerId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User", // Reference to the User model
      required: true,
    },
    type: {
      type: String,
      enum: ["item", "service"],
      required: true,
    },
    title: {
      type: String,
      required: [true, "Title is required"],
      trim: true,
      maxlength: [100, "Title cannot exceed 100 characters"],
    },
    description: {
      type: String,
      required: [true, "Description is required"],
      maxlength: [1000, "Description cannot exceed 1000 characters"],
    },
    images: {
      type: [String], // Array of image URLs
      validate: {
        validator: function (arr) {
          return arr.length > 0; // Ensure at least one image is provided
        },
        message: "At least one image is required",
      },
    },
    conditions: {
      type: String,
      enum: ["New", "Used"],
      required: true,
    },
    location: {
      type: String,
      required: true,
    },
    category: {
      type: String,
      required: true,
    },
    status: {
      type: String,
      enum: ["available", "traded"],
      default: "available",
    },
  },
  {
    timestamps: true, // Automatically adds createdAt and updatedAt fields
  }
);

const Listing = mongoose.model("Listing", listingSchema);

export default Listing;
