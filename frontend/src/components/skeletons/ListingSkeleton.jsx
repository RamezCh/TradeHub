const ListingSkeleton = () => {
  return (
    <div className="flex flex-col md:flex-row gap-6 p-4 bg-white shadow-lg rounded-lg animate-pulse">
      {/* Left: Image Carousel Skeleton */}
      <div className="flex-1 bg-gray-300 h-64 rounded-lg"></div>

      {/* Right: Details Skeleton */}
      <div className="flex-1 space-y-4">
        <div className="h-8 bg-gray-300 rounded w-3/4"></div>
        <div className="h-4 bg-gray-300 rounded w-1/2"></div>
        <div className="h-4 bg-gray-300 rounded w-1/4 mb-4"></div>

        {/* Buttons Skeleton */}
        <div className="flex gap-4 mb-4">
          <div className="h-8 bg-gray-300 rounded w-24"></div>
        </div>

        {/* Price Skeleton */}
        <div className="h-6 bg-gray-300 rounded w-1/3"></div>

        {/* Seller Info Skeleton */}
        <div className="flex items-center space-x-4">
          <div className="h-12 w-12 bg-gray-300 rounded-full"></div>
          <div className="flex-1 space-y-2">
            <div className="h-4 bg-gray-300 rounded w-1/2"></div>
            <div className="h-4 bg-gray-300 rounded w-1/4"></div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ListingSkeleton;
