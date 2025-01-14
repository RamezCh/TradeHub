import { useState, useEffect } from "react";
import { useOfferStore } from "../store/useOfferStore";
import OfferComponent from "../components/Offers Page/OfferComponent";
import { Info } from "lucide-react";

const OffersPage = () => {
  const {
    isLoading,
    offers,
    totalPages,
    currentPage,
    getOffers,
    setCurrentPage,
  } = useOfferStore();
  const [statusFilter, setStatusFilter] = useState("");
  const itemsPerPage = 5;

  useEffect(() => {
    getOffers(statusFilter, currentPage, itemsPerPage);
  }, [statusFilter, currentPage, getOffers]);

  const handleStatusFilterChange = (e) => {
    setStatusFilter(e.target.value);
    setCurrentPage(1);
  };

  return (
    <div className="p-8">
      <h1 className="text-3xl font-bold text-center mb-8">Offers</h1>

      {/* Status Filter Dropdown */}
      <div className="flex justify-center mb-8">
        <select
          value={statusFilter}
          onChange={handleStatusFilterChange}
          className="select select-bordered w-full max-w-xs"
        >
          <option value="">All Statuses</option>
          <option value="pending">Pending</option>
          <option value="accepted">Accepted</option>
          <option value="rejected">Rejected</option>
          <option value="completed">Completed</option>
        </select>
      </div>

      {/* Loading Indicator */}
      {isLoading && (
        <div className="flex justify-center">
          <span className="loading loading-spinner loading-lg"></span>
        </div>
      )}

      {/* Offers List */}
      {!isLoading && offers.length === 0 ? (
        <div className="flex flex-col items-center justify-center space-y-4 p-6 bg-base-200 rounded-lg border border-gray-200">
          <Info className="w-12 h-12 text-primary" />
          <p className="text-center text-primary text-lg font-medium">
            No offers found.
          </p>
          <p className="text-center text-secondary">
            Please check back later or try a different status.
          </p>
        </div>
      ) : (
        <div>
          {offers.map((offer) => (
            <OfferComponent key={offer._id} offer={offer} />
          ))}
        </div>
      )}

      {/* Pagination */}
      {!isLoading && totalPages > 1 && (
        <div className="flex justify-center mt-8">
          <div className="join">
            {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
              <button
                key={page}
                className={`join-item btn ${
                  currentPage === page ? "btn-active" : ""
                }`}
                onClick={() => setCurrentPage(page)}
              >
                {page}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default OffersPage;
