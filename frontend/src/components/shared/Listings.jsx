import DetailedItemCard from "./DetailedItemCard";
import { ArrowLeft, ArrowRight, Loader2, Frown } from "lucide-react";

const Listings = ({
  listings,
  totalListings,
  isLoadingListings,
  currentPage,
  setCurrentPage,
  itemsPerPage,
}) => {
  const totalPages = Math.ceil(totalListings / itemsPerPage);

  return (
    <div>
      {isLoadingListings ? (
        <div className="flex justify-center items-center h-[50vh]">
          <Loader2 className="w-12 h-12 text-primary animate-spin" />
        </div>
      ) : listings?.length > 0 ? (
        <div>
          {/* Display the current listings */}
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 p-4 pl-0">
            {listings.map((listing) => (
              <DetailedItemCard
                key={listing._id}
                itemId={listing._id}
                title={listing.title}
                image={listing.images[0]}
                location={listing.location}
                category={listing.category}
                condition={listing.condition}
                price={listing.price}
                acceptsOtherPaymentForm={listing.acceptsOtherPaymentForm}
                createdAt={listing.createdAt}
              />
            ))}
          </div>

          {/* Pagination component */}
          <div className="flex flex-nowrap overflow-x-auto justify-between items-center mt-4 p-4 gap-2">
            {/* Previous Button */}
            <button
              className={`btn btn-ghost ${
                currentPage === 1 ? "btn-disabled" : ""
              }`}
              onClick={() => setCurrentPage(currentPage - 1)}
            >
              <ArrowLeft className="mr-2" /> Previous
            </button>

            {/* Page Numbers */}
            <div className="flex flex-nowrap gap-1">
              {Array.from({ length: totalPages }, (_, i) => i + 1).map(
                (page) => (
                  <button
                    key={page}
                    className={`btn ${
                      currentPage === page ? "btn-primary" : "btn-ghost"
                    } min-w-[40px]`}
                    onClick={() => setCurrentPage(page)}
                  >
                    {page}
                  </button>
                )
              )}
            </div>

            {/* Next Button */}
            <button
              className={`btn btn-ghost ${
                currentPage === totalPages ? "btn-disabled" : ""
              }`}
              onClick={() => setCurrentPage(currentPage + 1)}
            >
              Next <ArrowRight className="ml-2" />
            </button>
          </div>
        </div>
      ) : (
        <div className="flex justify-center items-center h-[50vh]">
          <div className="text-center">
            <Frown className="w-12 h-12 text-gray-500 mx-auto" />
            <p className="text-gray-500 text-xl mt-4">No Listings Found</p>
          </div>
        </div>
      )}
    </div>
  );
};

export default Listings;
