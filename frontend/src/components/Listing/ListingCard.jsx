import { BadgeCheck, XCircle } from "lucide-react";
import { Link } from "react-router-dom";
import ImageCarousel from "./ImageCarousel";

const ListingCard = ({
  title,
  createdAt,
  images,
  status,
  linkPath,
  btnText = "Initiate Offer",
  sellerFullName,
  layout = "horizontal",
}) => {
  const formattedDate = new Date(createdAt).toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
  });

  const badgeStyles = status === "traded" ? "badge-error" : "badge-success";
  const statusIcon =
    status === "traded" ? (
      <XCircle className="w-5 h-5" />
    ) : (
      <BadgeCheck className="w-5 h-5" />
    );

  return (
    <div
      className={`card ${
        layout === "vertical" ? "" : "lg:card-side"
      } bg-base-100 shadow-xl`}
    >
      <figure
        className={`h-64 ${
          layout === "vertical" ? "w-full" : "w-full lg:w-1/3"
        } overflow-hidden`}
      >
        <ImageCarousel images={images} />
      </figure>
      <div className="card-body">
        <h2 className="card-title text-2xl">{title}</h2>
        <p className="text-sm text-gray-500">
          Listed on {formattedDate} by {sellerFullName}
        </p>
        <div className="mt-2 flex justify-between items-center">
          <span className={`badge gap-2 p-3 ${badgeStyles}`}>
            {statusIcon}
            {status.charAt(0).toUpperCase() + status.slice(1)}
          </span>
          <Link to={linkPath}>
            <button className="btn btn-sm btn-outline">{btnText}</button>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default ListingCard;
