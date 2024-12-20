const ItemCardSkeleton = () => {
  const skeletonCard = (
    <div className="card w-56 shadow-md animate-pulse bg-neutral">
      <figure>
        <div className="h-32 w-full bg-gray-300"></div>
      </figure>
      <div className="card-body p-3">
        <div className="h-4 bg-gray-300 rounded mb-2"></div>
        <div className="h-3 bg-gray-300 rounded mb-2"></div>
        <div className="h-3 bg-gray-300 rounded w-2/3 mb-4"></div>
        <div className="card-actions justify-end">
          <div className="btn bg-gray-300 border-none w-20 h-6"></div>
        </div>
      </div>
    </div>
  );

  return (
    <div className="flex justify-between gap-3">
      {Array(5)
        .fill(0)
        .map((_, index) => (
          <div key={index}>{skeletonCard}</div>
        ))}
    </div>
  );
};

export default ItemCardSkeleton;
