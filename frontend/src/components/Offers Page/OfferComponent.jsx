import { useState, useEffect } from "react";
import { useOfferStore } from "../../store/useOfferStore";
import { useAuthStore } from "../../store/useAuthStore";
import { useChatStore } from "../../store/useChatStore";
import { Link } from "react-router-dom";
import toast from "react-hot-toast";

const OfferComponent = ({ offer }) => {
  const { authUser } = useAuthStore();
  const {
    _id,
    listingId,
    sender,
    receiver,
    type,
    details,
    status,
    senderConfirmation,
    receiverConfirmation,
  } = offer;

  const { title, images } = listingId;

  // State for offer reply
  const [replyStatus, setReplyStatus] = useState("pending");
  const [replyMessage, setReplyMessage] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Store hooks
  const { replyToOffer, cancelOffer, isLoading } = useOfferStore();
  const { sendMessage, setSelectedUser, selectedUser } = useChatStore();

  useEffect(() => {
    setSelectedUser({ username: sender.username });
  }, [sender.username, setSelectedUser]);

  const handleReplyToOffer = async (e) => {
    e.preventDefault();
    try {
      await replyToOffer(selectedUser.username, replyStatus);
      setIsModalOpen(false);
      if (replyMessage.trim()) {
        await sendMessage({
          text: `Offer ${replyStatus} - ${replyMessage.trim()}`,
        });
      }
      setReplyMessage("");
    } catch (error) {
      console.error("Failed to reply to offer:", error);
      toast.error("Failed to reply to offer");
    }
  };

  const handleCancelOffer = async () => {
    try {
      await cancelOffer(_id);
    } catch (error) {
      console.error("Failed to cancel offer:", error);
    }
  };

  const isSender = sender._id === authUser._id;

  return (
    <div className="card bg-base-200 shadow-xl my-4">
      <div className="card-body">
        {/* Offer Type and Status */}
        <h2 className="card-title text-accent">
          Offer Type:{" "}
          <span className="text-primary">
            {type.charAt(0).toUpperCase() + type.slice(1)}
          </span>
        </h2>
        <p className="text-accent">
          Status:{" "}
          <span className="text-secondary">
            {status.charAt(0).toUpperCase() + status.slice(1)}
          </span>
        </p>

        {/* Listing Title and Images */}
        <div className="mt-4">
          <h3 className="text-lg font-semibold text-accent">
            Listing Title: <span className="text-primary">{title}</span>
          </h3>
          {images && images.length > 0 && (
            <div className="mt-2 flex gap-2 overflow-x-auto">
              {images.map((image, index) => (
                <img
                  key={index}
                  src={image}
                  alt={`${title} - Image ${index + 1}`}
                  className="h-48 w-auto object-cover rounded-lg"
                />
              ))}
            </div>
          )}
        </div>

        {/* Offer Details */}
        <p className="text-primary">{details}</p>

        {/* Sender and Receiver Info */}
        <div className="flex justify-between">
          <div>
            <p className="text-sm text-accent">
              Sender: <span className="text-secondary">{sender?.username}</span>
            </p>
            <p className="text-sm text-accent">
              Sender Confirmed:{" "}
              <span className="text-secondary">
                {senderConfirmation.confirmed ? "Yes" : "No"}
              </span>
            </p>
          </div>
          <div>
            <p className="text-sm text-accent">
              Receiver:{" "}
              <span className="text-secondary">{receiver?.username}</span>
            </p>
            <p className="text-sm text-accent">
              Receiver Confirmed:{" "}
              <span className="text-secondary">
                {receiverConfirmation.confirmed ? "Yes" : "No"}
              </span>
            </p>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="card-actions justify-end mt-4">
          {status === "pending" && (
            <>
              {!isSender && (
                <button
                  className="btn btn-primary"
                  onClick={() => setIsModalOpen(true)}
                >
                  Reply to Offer
                </button>
              )}
              {isSender && (
                <button
                  className="btn btn-error"
                  onClick={handleCancelOffer}
                  disabled={isLoading}
                >
                  Cancel Offer
                </button>
              )}
            </>
          )}
          {status === "accepted" && (
            <Link to={`/offers/${_id}/confirm`}>
              <button className="btn btn-primary">Mark as Completed</button>
            </Link>
          )}
          {status === "completed" && (
            <button className="btn btn-neutral" disabled>
              Offer Completed
            </button>
          )}
        </div>
      </div>

      {/* Offer Reply Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
          <div className="bg-base-100 p-6 rounded-lg w-full max-w-md">
            <h2 className="text-lg font-bold mb-4">Reply to Offer</h2>
            <form onSubmit={handleReplyToOffer}>
              <div className="form-control">
                <label className="label">
                  <span className="label-text">Status</span>
                </label>
                <select
                  className="select select-bordered w-full"
                  value={replyStatus}
                  onChange={(e) => setReplyStatus(e.target.value)}
                >
                  <option value="pending">Choose Reply</option>
                  <option value="accepted">Accepted</option>
                  <option value="rejected">Rejected</option>
                </select>
              </div>
              <div className="form-control">
                <label className="label">
                  <span className="label-text">Message</span>
                </label>
                <textarea
                  className="textarea textarea-bordered w-full"
                  placeholder="Type your message..."
                  value={replyMessage}
                  onChange={(e) => setReplyMessage(e.target.value)}
                />
              </div>
              <div className="mt-4 flex justify-end gap-2">
                <button
                  type="button"
                  className="btn btn-ghost"
                  onClick={() => setIsModalOpen(false)}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="btn btn-primary"
                  disabled={isLoading}
                >
                  {isLoading ? "Sending..." : "Send"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default OfferComponent;
