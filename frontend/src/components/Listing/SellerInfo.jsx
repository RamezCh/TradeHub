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
    <div className="mt-6 p-4 border rounded-lg">
      <div className="chat-image avatar">
        <div className="size-10 rounded-full border mr-2">
          <img src={profileImg || "/avatar.png"} alt="profile pic" />
        </div>
        <h2 className="text-lg font-semibold">
          {firstName} {lastName}
        </h2>
      </div>
      <p className="text-sm text-gray-500">Joined on {formattedDate}</p>
      <Link to={`/inbox/${username}`}>
        <button className="btn btn-primary btn-sm mt-4">
          Chat with Seller
        </button>
      </Link>
    </div>
  );
};

export default SellerInfo;
