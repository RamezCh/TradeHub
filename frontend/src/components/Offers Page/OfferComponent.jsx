import { Link } from "react-router-dom";

const OfferComponent = ({ offer }) => {
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
              {" "}
              {/* Flex container for images */}
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
              <button className="btn btn-primary">Accept Offer</button>
              <button className="btn btn-secondary">Reject Offer</button>
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
    </div>
  );
};

export default OfferComponent;
