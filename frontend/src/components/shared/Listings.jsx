import DetailedItemCard from "./DetailedItemCard";
import { ArrowLeft, ArrowRight } from "lucide-react";

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
        <div className="text-center py-10">
          <div className="w-12 h-12 border-2 border-primary border-t-0 rounded-full animate-spin"></div>
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
        <p className="text-center py-10">No Listings found</p>
      )}
    </div>
  );
};

export default Listings;
