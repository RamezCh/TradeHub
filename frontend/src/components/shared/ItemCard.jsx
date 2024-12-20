import { Link } from "react-router-dom";

const ItemCard = ({ itemId, title, image, location, createdAt }) => {
  const formatDate = (dateString) => {
    const options = { year: "numeric", month: "long", day: "numeric" };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  return (
    <div className="card bg-neutral w-64 shadow-xl">
      <figure>
        <img src={image} alt={title} className="h-44 object-fit w-full" />
      </figure>
      <div className="card-body">
        <h2 className="card-title">{title}</h2>
        <p className="text-sm text-gray-500">
          <strong>{location}, </strong> {formatDate(createdAt)}
        </p>
        <div className="card-actions justify-end">
          <Link to={`/listings/${itemId}`} className="btn btn-primary">
            View Details
          </Link>
        </div>
      </div>
    </div>
  );
};

export default ItemCard;
