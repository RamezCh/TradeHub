import { useState } from "react";
import { useOfferStore } from "../../store/useOfferStore";
import { X } from "lucide-react";

const OfferModal = ({ listingId, receiver, receiverUsername, onClose }) => {
  const [type, setType] = useState("item");
  const [details, setDetails] = useState("");
  const { createOffer, isLoading } = useOfferStore();

  const handleSubmit = async (e) => {
    e.preventDefault();
    await createOffer(listingId, receiver, type, details);
    onClose();

    setTimeout(() => {
      window.location.href = `/inbox/${receiverUsername}`;
    }, 3000);
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4">
      <div className="bg-base-100 rounded-lg w-full max-w-md shadow-lg">
        <div className="flex justify-between items-center border-b p-4">
          <h2 className="text-lg font-bold">Initiate Offer</h2>
          <button
            onClick={onClose}
            className="btn btn-ghost btn-sm"
            aria-label="Close Modal"
          >
            <X className="h-5 w-5" />
          </button>
        </div>
        <form onSubmit={handleSubmit} className="p-4">
          <div className="form-control mb-4">
            <label htmlFor="type" className="label">
              <span className="label-text">Offer Type</span>
            </label>
            <select
              id="type"
              value={type}
              onChange={(e) => setType(e.target.value)}
              className="select select-primary w-full"
              required
            >
              <option value="item">Item</option>
              <option value="service">Service</option>
              <option value="cash">Cash</option>
              <option value="mixed">Mixed</option>
            </select>
          </div>
          <div className="form-control mb-4">
            <label htmlFor="details" className="label">
              <span className="label-text">Offer Details</span>
            </label>
            <textarea
              id="details"
              value={details}
              onChange={(e) => setDetails(e.target.value)}
              className="textarea textarea-primary w-full"
              rows="4"
              required
            />
          </div>
          <div className="flex justify-end gap-2">
            <button
              type="button"
              onClick={onClose}
              className="btn btn-outline btn-neutral"
              disabled={isLoading}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="btn btn-primary"
              disabled={isLoading}
            >
              {isLoading ? "Submitting..." : "Submit Offer"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default OfferModal;
