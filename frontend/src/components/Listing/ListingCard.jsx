import { BadgeCheck } from "lucide-react";
import ImageCarousel from "./ImageCarousel";

const ListingCard = ({ title, createdAt, images, status }) => {
  const formattedDate = new Date(createdAt).toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
  });

  return (
    <div className="card lg:card-side bg-base-100 shadow-xl">
      <figure className="h-64 w-full lg:w-1/3 overflow-hidden">
        <ImageCarousel images={images} />
      </figure>
      <div className="card-body">
        <h2 className="card-title text-2xl">{title}</h2>
        <p className="text-sm text-gray-500">Listed on {formattedDate}</p>
        <div className="mt-2">
          <span className={`badge gap-2`}>
            <BadgeCheck className="w-4 h-4" />
            {status.charAt(0).toUpperCase() + status.slice(1)}
          </span>
        </div>
      </div>
    </div>
  );
};

export default ListingCard;
