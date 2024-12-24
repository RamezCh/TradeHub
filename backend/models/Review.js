import mongoose from "mongoose";

const reviewSchema = new mongoose.Schema({
  reviewer: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  reviewee: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true, // Reference to the seller being reviewed
  },
  offer: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Offer",
    required: true,
  },
  rating: { type: Number, required: true },
  comment: { type: String, required: true },
  image: { type: String },
  isOfferReview: {
    type: Boolean,
    default: false,
  },
});

const Review = mongoose.model("Review", reviewSchema);
export default Review;
