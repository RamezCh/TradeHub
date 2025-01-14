import { useState } from "react";
import { Camera, Mail, User, Pencil } from "lucide-react";
import { useAuthStore } from "../store/useAuthStore.js";

const ProfilePage = () => {
  const { authUser, isUpdatingProfile, updateProfile } = useAuthStore();
  const [selectedImg, setSelectedImg] = useState(null);
  const [selectedCoverImg, setSelectedCoverImg] = useState(null);
  const [isEditingBio, setIsEditingBio] = useState(false);
  const [newBio, setNewBio] = useState(authUser?.bio || "");

  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const reader = new FileReader();

    reader.readAsDataURL(file);

    reader.onload = async () => {
      const base64Image = reader.result;
      setSelectedImg(base64Image);
      await updateProfile({ profileImg: base64Image });
    };
  };

  const handleCoverImageUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const reader = new FileReader();

    reader.readAsDataURL(file);

    reader.onload = async () => {
      const base64CoverImage = reader.result;
      setSelectedCoverImg(base64CoverImage);
      await updateProfile({ coverImg: base64CoverImage });
    };
  };

  const handleBioChange = (e) => {
    setNewBio(e.target.value);
  };

  const saveBio = async () => {
    await updateProfile({ bio: newBio });
    setIsEditingBio(false);
  };

  return (
    <div className="min-h-screen pt-20 bg-base-100">
      <div className="max-w-2xl mx-auto p-4 py-8">
        <div className="bg-base-300 rounded-xl p-6 space-y-8 relative">
          {/* Cover image */}
          <div className="relative">
            <img
              src={
                selectedCoverImg ||
                authUser?.coverImg ||
                "/default-cover-image.jpg"
              }
              alt="Cover"
              className="w-full h-48 object-cover rounded-xl"
            />
            <label
              htmlFor="cover-upload"
              className={`absolute bottom-4 right-4 bg-base-content p-2 rounded-full cursor-pointer hover:scale-105 transition-all ${
                isUpdatingProfile ? "animate-pulse pointer-events-none" : ""
              }`}
            >
              <Camera className="w-5 h-5 text-base-200" />
              <input
                type="file"
                id="cover-upload"
                className="hidden"
                accept="image/*"
                onChange={handleCoverImageUpload}
                disabled={isUpdatingProfile}
              />
            </label>
          </div>

          {/* Profile Section Overlaying Cover Image */}
          <div className="absolute top-0 left-1/2 transform -translate-x-1/2 text-center">
            <div className="flex flex-col items-center gap-4">
              <div className="relative">
                <img
                  src={
                    selectedImg ||
                    authUser.profileImg ||
                    "/default-profile-image.png"
                  }
                  alt="Profile"
                  className="size-32 rounded-full object-cover border-4 "
                />
                <label
                  htmlFor="avatar-upload"
                  className={`absolute bottom-0 right-0 bg-base-content p-2 rounded-full cursor-pointer hover:scale-105 transition-all ${
                    isUpdatingProfile ? "animate-pulse pointer-events-none" : ""
                  }`}
                >
                  <Camera className="w-5 h-5 text-base-200" />
                  <input
                    type="file"
                    id="avatar-upload"
                    className="hidden"
                    accept="image/*"
                    onChange={handleImageUpload}
                    disabled={isUpdatingProfile}
                  />
                </label>
              </div>
              <h1 className="text-2xl font-semibold">Profile</h1>
            </div>
          </div>

          {/* Bio */}
          <div className="text-center mt-4">
            <h2 className="text-lg font-medium">About Me</h2>
            <div className="flex items-center justify-between mt-2">
              {isEditingBio ? (
                <div className="w-full">
                  <textarea
                    value={newBio}
                    onChange={handleBioChange}
                    rows="4"
                    className="textarea textarea-bordered w-full max-w-xs"
                  />
                  <button onClick={saveBio} className="btn btn-primary mt-2">
                    Save Bio
                  </button>
                </div>
              ) : (
                <>
                  <p className="text-sm text-zinc-400 w-full">{authUser.bio}</p>
                  <button
                    onClick={() => setIsEditingBio(true)}
                    className="btn btn-icon bg-transparent"
                  >
                    <Pencil className="w-5 h-5 text-base-400" />
                  </button>
                </>
              )}
            </div>
          </div>

          {/* Personal Info */}
          <div className="space-y-6 mt-40">
            <div className="space-y-1.5">
              <div className="text-sm text-zinc-400 flex items-center gap-2">
                <User className="w-4 h-4" />
                Full Name
              </div>
              <p className="px-4 py-2.5 bg-base-200 rounded-lg border">
                {authUser?.firstName} {authUser?.lastName}
              </p>
            </div>

            <div className="space-y-1.5">
              <div className="text-sm text-zinc-400 flex items-center gap-2">
                <Mail className="w-4 h-4" />
                Email Address
              </div>
              <p className="px-4 py-2.5 bg-base-200 rounded-lg border">
                {authUser?.email}
              </p>
            </div>
          </div>

          {/* Languages Section (for Sellers) */}
          {authUser?.sellerStatus && (
            <div className="mt-6 bg-base-300 rounded-xl p-6">
              <h2 className="text-lg font-medium mb-4">Languages</h2>
              <div className="space-y-3 text-sm">
                {authUser.languages?.map((lang, index) => (
                  <div
                    key={index}
                    className="flex items-center justify-between py-2 border-b border-zinc-700"
                  >
                    <span>{lang.name}</span>
                    <span className="text-zinc-400">{lang.level}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Account Information */}
          <div className="mt-6 bg-base-300 rounded-xl p-6">
            <h2 className="text-lg font-medium mb-4">Account Information</h2>
            <div className="space-y-3 text-sm">
              <div className="flex items-center justify-between py-2 border-b border-zinc-700">
                <span>Member Since</span>
                <span>{authUser.createdAt?.split("T")[0]}</span>
              </div>
              <div className="flex items-center justify-between py-2">
                <span>Account Status</span>
                <span className="text-green-500">Active</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;
