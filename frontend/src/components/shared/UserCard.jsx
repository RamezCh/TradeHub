import { Link } from "react-router-dom";
import { Calendar, User } from "lucide-react";

const UserCard = ({
  profileImg = "/default-profile-image.png",
  firstName,
  lastName,
  createdAt,
  username,
}) => {
  return (
    <div className="card card-side bg-base-200 shadow-xl w-full md:w-96">
      <figure className="flex items-center justify-center p-4 w-1/3">
        <img
          src={profileImg || "/default-profile-image.png"}
          alt={`Profile of ${firstName} ${lastName}`}
          className="rounded-full object-cover h-24 w-24 border-4 border-primary"
        />
      </figure>
      <div className="card-body p-4">
        <h2 className="card-title flex items-center gap-2 text-primary">
          <User className="w-5 h-5" /> {firstName} {lastName}
        </h2>
        <p className="text-sm text-neutral flex items-center gap-2">
          <Calendar className="w-4 h-4" /> Joined:{" "}
          {new Date(createdAt).toLocaleDateString()}
        </p>
        <p className="text-sm text-neutral">@{username}</p>

        <div className="card-actions justify-end mt-4">
          <Link to={`/admin/user/${username}`}>
            <button className="btn btn-primary btn-sm">Edit</button>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default UserCard;
