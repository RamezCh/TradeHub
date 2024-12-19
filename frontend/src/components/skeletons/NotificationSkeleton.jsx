const NotificationSkeleton = () => {
  // Create an array of 5 items for skeleton notifications
  const skeletonNotifications = Array(5).fill(null);

  return (
    <div className="relative">
      <div className="absolute top-full right-0 mt-2 w-60 bg-white border border-gray-300 rounded-sm shadow-lg z-10">
        <ul className="space-y-2 p-2">
          {skeletonNotifications.map((_, idx) => (
            <li key={idx} className="flex items-center space-x-2">
              <div className="skeleton h-4 w-full rounded-sm" />
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default NotificationSkeleton;
