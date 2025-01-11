import { useListingStore } from "../../store/useListingStore";
import { useEffect, useState } from "react";
import DetailedItemCard from "./DetailedItemCard";
import { ArrowLeft, ArrowRight } from "lucide-react";

const Listings = (type = "all", query = "") => {
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;
  const {
    fetchListings,
    searchListings,
    listings,
    totalListings,
    isLoadingListings,
  } = useListingStore();

  useEffect(() => {
    if (query) {
      // page, itemsPerPage, filters, searchQuery
      searchListings(currentPage, itemsPerPage, type, query);
    } else {
      fetchListings(currentPage, itemsPerPage, type);
    }
  }, [currentPage, fetchListings, itemsPerPage, type, query, searchListings]);

  const totalPages = Math.ceil(totalListings / itemsPerPage);

  return (
    <div>
      {isLoadingListings ? (
        <div className="flex items-center justify-center w-full h-[800px] text-center py-10">
          <div className="w-12 h-12 border-2 border-primary border-t-0 rounded-full animate-spin"></div>
        </div>
      ) : listings?.length > 0 ? (
        <div>
          {/* Display the current listings */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-y-6 ml-24 mr-10 p-10">
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
          <div className="flex justify-between items-center mt-4">
            <button
              className={`btn btn-ghost ${
                currentPage === 1 ? "btn-disabled" : ""
              }`}
              onClick={() => setCurrentPage(currentPage - 1)}
            >
              <ArrowLeft className="mr-2" /> Previous
            </button>
            <div>
              {Array.from({ length: totalPages }, (_, i) => i + 1).map(
                (page) => (
                  <button
                    key={page}
                    className={`btn ${
                      currentPage === page ? "btn-primary" : "btn-ghost"
                    } mx-1`}
                    onClick={() => setCurrentPage(page)}
                  >
                    {page}
                  </button>
                )
              )}
            </div>
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
