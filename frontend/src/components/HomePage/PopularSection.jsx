import { useState, useEffect } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { motion } from "framer-motion";
import { useListingsStore } from "../../store/useListingStore";

const PopularSection = ({ type = "all" }) => {
  const [startIndex, setStartIndex] = useState(0);
  const itemsPerPage = 5;
  const { listings, totalListings, isLoadingListings, fetchListings } =
    useListingsStore();

  useEffect(() => {
    fetchListings(1, itemsPerPage, type); // Fetch listings based on type when the component mounts
  }, [fetchListings, type]);

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

  if (isLoadingListings) return <p>Loading...</p>; // Display loading state while fetching listings

  // Check if there are no listings available
  if (!listings || listings.length === 0) {
    return <p>No {type} found.</p>; // Display a message when no listings are available
  }

  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold mb-6 text-center">Popular {type}</h1>
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
            {listings
              .slice(startIndex, startIndex + itemsPerPage)
              .map((item) => (
                <div
                  className="flex-shrink-0 w-1/5 bg-base-200 p-4 rounded-lg shadow-md text-center"
                  key={item._id} // Ensure each item has a unique key
                >
                  {item.name}
                </div>
              ))}
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

export default PopularSection;
