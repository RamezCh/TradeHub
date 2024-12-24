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
      enum: ["New", "Used"],
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
      required: function () {
        return !this.tradeOptions;
      },
    },
    tradeOptions: {
      type: [
        {
          type: {
            type: String,
            enum: [
              "item",
              "service",
              "price+item",
              "service+price",
              "service+item",
            ],
            required: true,
          },
        },
      ],
      validate: {
        validator: function (v) {
          return this.price || (v && v.length > 0); // Ensure at least one of price or tradeOptions is provided
        },
        message: "Either price or tradeOptions must be provided.",
      },
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
  },
  {
    timestamps: true, // Automatically adds createdAt and updatedAt fields
  }
);

const Listing = mongoose.model("Listing", listingSchema);
export default Listing;

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

listingSchema.pre("save", function (next) {
  this.calculateAverageRating();
  next();
});
