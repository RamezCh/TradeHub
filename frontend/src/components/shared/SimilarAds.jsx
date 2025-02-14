import { useState, useEffect } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { motion } from "framer-motion";
import { useListingStore } from "../../store/useListingStore";
import ItemCard from "../shared/ItemCard";
import ItemCardSkeleton from "../skeletons/ItemCardSkeleton";

const SimilarAds = ({ type, category, doNotMatchID }) => {
  const [startIndex, setStartIndex] = useState(0);
  const itemsPerPage = 5;

  const {
    services,
    items,
    totalServices,
    totalItems,
    isLoadingItems,
    isLoadingServices,
    fetchListings,
  } = useListingStore();

  const isServiceType = type === "service";
  const listings = isServiceType ? services : items;
  const totalListings = isServiceType ? totalServices : totalItems;
  const isLoadingListings = isServiceType ? isLoadingServices : isLoadingItems;

  useEffect(() => {
    fetchListings(1, itemsPerPage, type, category);
  }, [fetchListings, type, category]);

  const handleNext = () => {
    if (startIndex + itemsPerPage < totalListings) {
      setStartIndex(startIndex + itemsPerPage);
    }
  };

  const handlePrev = () => {
    if (startIndex - itemsPerPage >= 0) {
      setStartIndex(startIndex - itemsPerPage);
    }
  };

  const slidingVariants = {
    initial: (direction) => ({
      x: direction > 0 ? 1000 : -1000,
    }),
    animate: { x: 0 },
    exit: (direction) => ({
      x: direction > 0 ? -1000 : 1000,
    }),
  };

  const filteredListings = listings
    ? listings.filter(
        (item) => item.category === category && item._id !== doNotMatchID
      )
    : [];

  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold mb-6 text-center">
        {filteredListings.length > 0
          ? `Similar ${type} in ${category}`
          : `No similar ${type} found in ${category}.`}
      </h1>
      <div className="flex items-center justify-center gap-4">
        <button
          className="btn btn-circle btn-outline"
          onClick={handlePrev}
          disabled={startIndex === 0}
        >
          <ChevronLeft className="w-6 h-6" />
        </button>
        <div className="relative overflow-hidden w-full max-w-4xl">
          <motion.div
            className="flex gap-4"
            custom={startIndex}
            variants={slidingVariants}
            initial="initial"
            animate="animate"
            exit="exit"
            transition={{
              type: "spring",
              stiffness: 300,
              damping: 30,
            }}
            key={startIndex}
          >
            {!isLoadingListings ? (
              filteredListings.length > 0 ? (
                filteredListings
                  .slice(startIndex, startIndex + itemsPerPage)
                  .map((item) => (
                    <ItemCard
                      key={item._id}
                      itemId={item._id}
                      title={item.title}
                      description={item.description}
                      image={item.images[0]}
                      condition={item.condition}
                      location={item.location}
                      category={item.category}
                      createdAt={item.createdAt}
                    />
                  ))
              ) : (
                <p className="w-full text-center">No similar ads found</p>
              )
            ) : (
              <ItemCardSkeleton />
            )}
          </motion.div>
        </div>
        <button
          className="btn btn-circle btn-outline"
          onClick={handleNext}
          disabled={startIndex + itemsPerPage >= totalListings}
        >
          <ChevronRight className="w-6 h-6" />
        </button>
      </div>
    </div>
  );
};

export default SimilarAds;
