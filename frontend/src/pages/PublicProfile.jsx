import { Mail, User } from "lucide-react";
import { useParams } from "react-router-dom";
import { useUserStore } from "../store/useUserStore";
import { useEffect } from "react";
import PublicProfileSkeleton from "../components/skeletons/PublicProfileSkeleton";

const PublicProfile = () => {
  const { username } = useParams();
  const { userProfile, getUserProfile, isLoadingProfile } = useUserStore();
  const profile = userProfile || {};

  useEffect(() => {
    getUserProfile(username);
  }, [username, getUserProfile]);

  return isLoadingProfile ? (
    <PublicProfileSkeleton />
  ) : (
    <div className="min-h-screen pt-20 bg-base-100">
      <div className="max-w-2xl mx-auto p-4 py-8">
        <div className="bg-base-300 rounded-xl p-8 space-y-12 relative">
          {/* Cover image */}
          <div className="relative">
            <img
              src={profile.coverImg || "/default-cover-image.jpg"}
              alt="Cover"
              className="w-full h-48 object-cover rounded-xl"
            />
          </div>

          {/* Profile Section */}
          <div className="absolute top-0 left-1/2 transform -translate-x-1/2 text-center mt-[-4rem]">
            <div className="flex flex-col items-center gap-4">
              <div className="relative">
                <img
                  src={profile.profileImg || "/default-profile-image.png"}
                  alt="Profile"
                  className="w-32 h-32 rounded-full object-cover border-4 border-white"
                />
              </div>
              <h1 className="text-2xl font-semibold">
                {profile.firstName} {profile.lastName}
              </h1>
            </div>
          </div>

          {/* Bio */}
          <div className="text-center mt-20">
            <h2 className="text-lg font-medium">About Me</h2>
            <p className="text-sm text-zinc-400 w-full">{profile.bio}</p>
          </div>

          {/* Personal Info */}
          <div className="space-y-8 mt-20">
            <div className="space-y-2">
              <div className="text-sm text-zinc-400 flex items-center gap-2">
                <User className="w-4 h-4" />
                Full Name
              </div>
              <p className="px-4 py-3 bg-base-200 rounded-lg border">
                {profile.firstName} {profile.lastName}
              </p>
            </div>

            <div className="space-y-2">
              <div className="text-sm text-zinc-400 flex items-center gap-2">
                <Mail className="w-4 h-4" />
                Email Address
              </div>
              <p className="px-4 py-3 bg-base-200 rounded-lg border">
                {profile.email}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PublicProfile;
