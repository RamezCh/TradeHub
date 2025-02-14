import { Link } from "react-router-dom";

const ItemCard = ({ itemId, title, image, location, createdAt }) => {
  const formatDate = (dateString) => {
    const options = { year: "numeric", month: "long", day: "numeric" };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  return (
    <div className="card bg-neutral w-64 shadow-xl">
      <figure className="card-img h-44 overflow-hidden">
        <img src={image} alt={title} className="w-full h-full object-cover" />
      </figure>
      <div className="card-body">
        <h2 className="card-title text-primary">{title}</h2>
        <p className="text-sm text-neutral-content">
          <strong>{location}, </strong> {formatDate(createdAt)}
        </p>
        <div className="card-actions justify-end">
          <Link to={`/listing/${itemId}`} className="btn btn-primary">
            View Details
          </Link>
        </div>
      </div>
    </div>
  );
};

export default ItemCard;
