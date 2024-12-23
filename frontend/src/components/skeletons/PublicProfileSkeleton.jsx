const PublicProfile = () => {
  return (
    <div className="min-h-screen pt-20 bg-base-100">
      <div className="max-w-2xl mx-auto p-4 py-8">
        <div className="bg-base-300 rounded-xl p-8 space-y-12 relative">
          {/* Skeleton for Cover Image */}
          <div className="skeleton h-48 w-full rounded-xl"></div>

          {/* Profile Section Skeleton */}
          <div className="absolute top-0 left-1/2 transform -translate-x-1/2 text-center mt-[-4rem]">
            <div className="flex flex-col items-center gap-4">
              {/* Skeleton for Profile Image */}
              <div className="skeleton w-32 h-32 rounded-full"></div>
              <div className="skeleton w-24 h-6"></div>{" "}
              {/* Skeleton for Name */}
            </div>
          </div>

          {/* Skeleton for Bio */}
          <div className="text-center mt-20">
            <div className="skeleton w-1/4 h-4"></div>{" "}
            {/* Skeleton for About Me Heading */}
            <div className="skeleton mt-4 w-full h-4"></div>{" "}
            {/* Skeleton for Bio */}
          </div>

          {/* Personal Info Skeleton */}
          <div className="space-y-8 mt-20">
            <div className="space-y-2">
              <div className="skeleton w-24 h-4"></div>{" "}
              {/* Skeleton for Full Name Label */}
              <div className="skeleton w-full h-12"></div>{" "}
              {/* Skeleton for Full Name */}
            </div>

            <div className="space-y-2">
              <div className="skeleton w-24 h-4"></div>{" "}
              {/* Skeleton for Email Address Label */}
              <div className="skeleton w-full h-12"></div>{" "}
              {/* Skeleton for Email Address */}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PublicProfile;
