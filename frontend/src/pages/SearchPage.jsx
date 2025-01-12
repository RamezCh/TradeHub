import FilterSidebar from "../components/shared/FilterSidebar";
import Listings from "../components/shared/Listings";
import { useListingStore } from "../store/useListingStore";
import { useSearchParams } from "react-router-dom";
import { useEffect, useState } from "react";

const SearchPage = () => {
  const [searchParams] = useSearchParams();
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 8;
  const {
    fetchListings,
    searchListings,
    listings,
    totalListings,
    isLoadingListings,
  } = useListingStore();

  const query = searchParams.get("query");
  const type = searchParams.get("type") || "";
  const priceMin = parseFloat(searchParams.get("priceMin")) || null;
  const priceMax = parseFloat(searchParams.get("priceMax")) || null;
  const category = searchParams.get("category") || "";
  const location = searchParams.get("location") || "";
  const condition = searchParams.get("condition") || "";
  const acceptsOtherPaymentForm =
    searchParams.get("acceptsOtherPaymentForm") || "";

  useEffect(() => {
    const filters = {
      query,
      type,
      priceMin,
      priceMax,
      category,
      location,
      condition,
      acceptsOtherPaymentForm,
    };

    // Remove empty filters
    Object.keys(filters).forEach((key) => {
      if (!filters[key]) {
        delete filters[key];
      }
    });

    if (Object.keys(filters).length > 0) {
      searchListings(currentPage, itemsPerPage, filters);
    } else {
      fetchListings(currentPage, itemsPerPage);
    }
  }, [
    currentPage,
    fetchListings,
    itemsPerPage,
    query,
    searchListings,
    type,
    priceMin,
    priceMax,
    category,
    location,
    condition,
    acceptsOtherPaymentForm,
  ]);

  return (
    <div className="flex flex-col lg:flex-row">
      {/* Sidebar with Filters */}
      <div className="w-full lg:w-1/4 p-4">
        <FilterSidebar />
      </div>

      {/* Main Content Area */}
      <main className="flex-1 p-4">
        <h1 className="text-2xl font-bold mb-4">Items and Services</h1>
        <Listings
          currentPage={currentPage}
          setCurrentPage={setCurrentPage}
          itemsPerPage={itemsPerPage}
          listings={listings}
          totalListings={totalListings}
          isLoadingListings={isLoadingListings}
        />
      </main>
    </div>
  );
};

export default SearchPage;
