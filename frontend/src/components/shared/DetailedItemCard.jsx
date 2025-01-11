import { Link } from "react-router-dom";

const DetailedItemCard = ({
  itemId,
  title,
  image,
  location,
  createdAt,
  category,
  price,
  condition,
  acceptsOtherPaymentForm,
}) => {
  const formatDate = (dateString) => {
    const options = { year: "numeric", month: "long", day: "numeric" };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  return (
    <div className="card bg-neutral w-80 shadow-xl hover:shadow-2xl transition-shadow duration-300">
      <figure className="card-img h-56 overflow-hidden rounded-t-lg">
        <img
          src={image}
          alt={title}
          className="w-full h-full object-cover transition-transform duration-300 hover:scale-105"
        />
      </figure>
      <div className="card-body p-6">
        <h2 className="card-title text-primary text-xl font-bold mb-2">
          {title}
        </h2>
        <div className="flex items-center text-sm text-neutral-content mb-2">
          <span className="font-medium">{category}</span>
          {condition && (
            <>
              <span className="mx-1">·</span>
              <span className="font-medium">
                {condition.charAt(0).toUpperCase() + condition.slice(1)}
              </span>
            </>
          )}
        </div>
        <p className="text-sm text-neutral-content mb-4">
          <strong>{location}</strong> · {formatDate(createdAt)}
        </p>
        {acceptsOtherPaymentForm && acceptsOtherPaymentForm !== "none" && (
          <p className="text-sm text-neutral-content mb-4">
            Other Payment Methods:{" "}
            <span className="font-medium">
              {acceptsOtherPaymentForm === "both"
                ? "Items and Services"
                : acceptsOtherPaymentForm.charAt(0).toUpperCase() +
                  acceptsOtherPaymentForm.slice(1)}
            </span>
          </p>
        )}

        <div className="flex flex-row card-actions justify-between items-center">
          <span className="text-lg font-semibold text-primary">${price}</span>
          <Link
            to={`/listing/${itemId}`}
            className="btn btn-secondary text-white hover:bg-primary-focus transition-colors duration-300"
          >
            View Details
          </Link>
        </div>
      </div>
    </div>
  );
};

export default DetailedItemCard;
