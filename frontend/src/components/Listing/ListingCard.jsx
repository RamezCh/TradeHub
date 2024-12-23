const ListingCard = ({ title, createdAt, images, status }) => {
  const formattedDate = new Date(createdAt).toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
  });

  return (
    <div className="card lg:card-side bg-base-100 shadow-xl">
      <figure className="h-64 w-full lg:w-1/3 bg-base-200">
        <img
          src={images[0]}
          alt={title}
          className="object-cover h-full w-full"
        />
      </figure>
      <div className="card-body">
        <h2 className="card-title">{title}</h2>
        <p>{formattedDate}</p>
        <p>{status[0].toUpperCase() + status.slice(1)}</p>
      </div>
    </div>
  );
};

export default ListingCard;
