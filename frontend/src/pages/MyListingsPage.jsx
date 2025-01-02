import { useEffect, useState } from "react";
import { useListingStore } from "../store/useListingStore";
import ListingCardOwner from "../components/Listing/ListingCardOwner";

const MyListingPage = () => {
  const [listings, setListings] = useState([]);
  const [error, setError] = useState(null);
  const { getMyListings, isLoadingListing } = useListingStore();

  useEffect(() => {
    const fetchListings = async () => {
      try {
        const listingReturned = await getMyListings();
        if (Array.isArray(listingReturned)) {
          setListings(listingReturned);
        } else {
          console.error(
            "Expected an array of listings, but got:",
            listingReturned
          );
          setError("Failed to fetch listings.");
        }
      } catch (err) {
        setError("An error occurred while fetching listings.", err);
      }
    };
    fetchListings();
  }, [getMyListings]);

  // Callback function to handle listing deletion
  const handleDeleteListing = (deletedListingId) => {
    setListings((prevListings) =>
      prevListings.filter((listing) => listing._id !== deletedListingId)
    );
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-semibold mb-6">My Listing</h1>

      {isLoadingListing ? (
        <p>Loading...</p>
      ) : error ? (
        <p className="text-red-500">{error}</p>
      ) : listings?.length === 0 ? (
        <div className="text-center">
          <p className="text-lg text-gray-500">No listings found.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {listings.map((listing) => (
            <ListingCardOwner
              key={listing._id}
              listing={listing}
              onDelete={handleDeleteListing} // Pass the callback to handle deletion
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default MyListingPage;
