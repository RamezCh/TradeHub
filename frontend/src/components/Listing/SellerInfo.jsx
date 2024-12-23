import { Link } from "react-router-dom";

const SellerInfo = ({
  firstName,
  lastName,
  profileImg,
  createdAt,
  username,
}) => {
  const formattedDate = new Date(createdAt).toLocaleString("en-US", {
    month: "long",
    year: "numeric",
  });

  return (
    <div className="card bg-base-100 shadow-md">
      <div className="card-body items-center text-center">
        <div className="avatar mb-4">
          <div className="w-24 rounded-full ring ring-primary ring-offset-base-100 ring-offset-2">
            <img src={profileImg || "/avatar.png"} alt="Profile" />
          </div>
        </div>
        <h2 className="card-title">
          {firstName} {lastName}
        </h2>
        <p className="text-sm text-gray-500">Joined on {formattedDate}</p>
        <Link to={`/inbox/${username}`} className="mt-4 w-full">
          <button className="btn btn-primary btn-outline btn-sm w-full">
            Chat with Seller
          </button>
        </Link>
      </div>
    </div>
  );
};

export default SellerInfo;
