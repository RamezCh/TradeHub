import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useOfferStore } from "../../store/useOfferStore";
import Dropdown from "../../components/shared/Dropdown";
import TextArea from "../../components/shared/TextArea";

const LeaveReviewForm = ({ listingId }) => {
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState("");
  const { leaveReview } = useOfferStore();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      await leaveReview(listingId, { rating, comment });
      navigate("/");
    } catch (error) {
      console.error("Error submitting review:", error);
      alert("Failed to submit review. Please try again.");
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6 max-w-md mx-auto">
      <Dropdown
        label="Rating"
        name="rating"
        value={rating}
        options={[
          { label: "Select a rating", value: 0 },
          { label: "1 - Poor", value: 1 },
          { label: "2 - Fair", value: 2 },
          { label: "3 - Good", value: 3 },
          { label: "4 - Very Good", value: 4 },
          { label: "5 - Excellent", value: 5 },
        ]}
        onChange={(e) => setRating(Number(e.target.value))}
        required
      />
      <TextArea
        label="Comment"
        name="comment"
        value={comment}
        onChange={(e) => setComment(e.target.value)}
        placeholder="Write your review here..."
        required
        maxLength={500}
      />
      <button type="submit" className="btn btn-primary w-full">
        Submit Review
      </button>
    </form>
  );
};

export default LeaveReviewForm;
