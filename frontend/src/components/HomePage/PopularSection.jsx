import { useState, useEffect } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { motion } from "framer-motion";
import { useListingStore } from "../../store/useListingStore";
import ItemCard from "../shared/ItemCard";
import ItemCardSkeleton from "../skeletons/ItemCardSkeleton";

const PopularSection = ({ type }) => {
  const [startIndex, setStartIndex] = useState(0);
  const [itemsPerPage, setItemsPerPage] = useState(5);

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

  // Reset startIndex when itemsPerPage changes
  useEffect(() => {
    setStartIndex(0);
  }, [itemsPerPage]);

  // Debounce function
  const debounce = (func, delay) => {
    let timeoutId;
    return (...args) => {
      clearTimeout(timeoutId);
      timeoutId = setTimeout(() => {
        func.apply(null, args);
      }, delay);
    };
  };

  const handleResize = () => {
    if (window.innerWidth < 768) {
      setItemsPerPage(1);
    } else if (window.innerWidth >= 768 && window.innerWidth <= 1024) {
      setItemsPerPage(3);
    } else {
      setItemsPerPage(5);
    }
  };

  // Debounced handleResize
  const handleResizeDebounced = debounce(handleResize, 100);

  useEffect(() => {
    handleResize();
    window.addEventListener("resize", handleResizeDebounced);
    return () => {
      window.removeEventListener("resize", handleResizeDebounced);
    };
  }, [handleResizeDebounced]);

  useEffect(() => {
    fetchListings(1, itemsPerPage, type);
  }, [fetchListings, type, itemsPerPage]);

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

  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold mb-6 text-center">
        {listings ? `Popular ${type}` : `No ${type} found.`}
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
            key={`${startIndex}-${itemsPerPage}`}
          >
            {!isLoadingListings ? (
              listings ? (
                listings
                  .slice(startIndex, startIndex + itemsPerPage)
                  .map((item) => (
                    <ItemCard
                      key={item._id}
                      itemId={item._id}
                      title={item.title}
                      image={item.images[0]}
                      location={item.location}
                      createdAt={item.createdAt}
                    />
                  ))
              ) : (
                <p className="w-full text-center">No Listings Found</p>
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

export default PopularSection;
