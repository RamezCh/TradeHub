import { useAdminStore } from "../../store/useAdminStore";
import { Loader } from "lucide-react";
import { useEffect } from "react";
import SearchBar from "../../components/shared/SearchBar";
import ListingCard from "../../components/Listing/ListingCard";

const AdminPendingListingsPage = () => {
  const {
    isLoading,
    listings,
    getPendingListings,
    totalPages,
    currentPage,
    setPage,
    setSearchTermAndType,
  } = useAdminStore();

  useEffect(() => {
    getPendingListings();
  }, [getPendingListings]);

  const handleSearch = (term, type) => {
    setSearchTermAndType(term, type);
    getPendingListings();
    setPage(1);
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <Loader className="w-10 h-10 animate-spin text-primary" />
      </div>
    );
  }
  return (
    <div className="min-h-screen flex flex-col justify-between">
      <div>
        <div className="p-6 mb-6">
          {/* SearchBar */}
          <SearchBar
            dropdownOptions={["title", "seller", "id"]}
            onSearch={handleSearch}
            placeholder="Search by title, seller name, or by listing ID"
          />
        </div>
        <div className="p-6">
          {/* Grid for User Cards */}
          <div className="grid grid-cols-1 gap-8 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-4">
            {listings.length === 0 ? (
              <p>No users found</p>
            ) : (
              listings.map((listing) => {
                return (
                  <ListingCard
                    key={listing._id}
                    title={listing.title}
                    createdAt={listing.createdAt}
                    images={listing.images}
                    status={listing.approvalStatus}
                    btnText="Evaluate"
                    linkPath={`/admin/listing/${listing._id}`}
                    sellerFullName={`${listing.seller.firstName} ${listing.seller.lastName}`}
                    layout="vertical"
                  />
                );
              })
            )}
          </div>
        </div>
      </div>
      <div className="p-6 flex justify-center items-center m-20">
        {/* Pagination */}
        <div className="join space-x-4">
          {Array.from({ length: totalPages }, (_, index) => (
            <input
              key={index}
              className="join-item btn btn-square border border-gray-300 focus:ring focus:ring-blue-300"
              type="radio"
              name="options"
              aria-label={index + 1}
              checked={currentPage === index + 1}
              onChange={() => setPage(index + 1)}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default AdminPendingListingsPage;
