import mongoose from "mongoose";

const listingSchema = new mongoose.Schema(
  {
    seller: {
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
    condition: {
      type: String,
      enum: ["new", "used", "refurbished"],
      required: true,
    },
    location: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Location", // Reference to Location collection
      required: true,
    },
    category: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Category", // Reference to Category collection
      required: true,
    },
    status: {
      type: String,
      enum: ["available", "traded"],
      default: "available",
    },
    price: {
      type: Number,
      required: true,
    },
    acceptsOtherPaymentForm: {
      type: String,
      enum: ["items", "services", "both", "none"],
      default: "none", // Default to accepting only cash
    },
    rating: {
      type: Number,
      default: 0, // Average rating
      min: 0,
      max: 5,
    },
    reviews: [
      {
        reviewer: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "User",
          required: true,
        },
        rating: {
          type: Number,
          required: true,
          min: 1,
          max: 5, // Ratings are typically between 1 and 5
        },
        comment: {
          type: String,
          required: true,
          maxlength: [1000, "Comment cannot exceed 1000 characters"],
        },
        createdAt: {
          type: Date,
          default: Date.now, // Timestamp for the review
        },
      },
    ],
    approvalStatus: {
      type: String,
      enum: ["pending", "approved", "rejected"],
      default: "pending",
    },
    rejectionReason: {
      type: String,
      maxlength: [500, "Rejection reason cannot exceed 500 characters"],
      required: function () {
        return this.approvalStatus === "rejected"; // Required only if approvalStatus is "rejected"
      },
    },
  },
  {
    timestamps: true, // Automatically adds createdAt and updatedAt fields
  }
);

// Method to calculate average rating
listingSchema.methods.calculateAverageRating = function () {
  if (this.reviews.length > 0) {
    const totalRating = this.reviews.reduce(
      (sum, review) => sum + review.rating,
      0
    );
    this.rating = totalRating / this.reviews.length;
  } else {
    this.rating = 0; // No reviews, so no rating
  }
};

// Pre-save hook to calculate average rating before saving
listingSchema.pre("save", function (next) {
  this.calculateAverageRating();
  next();
});

const Listing = mongoose.model("Listing", listingSchema);
export default Listing;
