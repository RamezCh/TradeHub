import { useState, useEffect } from "react";
import FilterSidebar from "../components/shared/FilterSidebar";
import Listings from "../components/shared/Listings";

const LoggedHomePage = () => {
  const [searchParamsState, setSearchParamsState] = useState({
    type: "all",
    query: "",
    conditions: "",
    location: "",
    category: "",
    min: 0,
    max: 1000,
    paymentForm: "",
  });

  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const params = {
      type: urlParams.get("type") || "all",
      query: urlParams.get("query") || "",
      conditions: urlParams.get("conditions") || "",
      location: urlParams.get("location") || "",
      category: urlParams.get("category") || "",
      min: parseFloat(urlParams.get("min")) || 0,
      max: parseFloat(urlParams.get("max")) || 1000,
      paymentForm: urlParams.get("paymentForm") || "",
    };
    setSearchParamsState(params);
  }, []);

  return (
    <div className="flex">
      {/* Sidebar with Filters */}
      <FilterSidebar
        setSearchParams={setSearchParamsState}
        searchParams={searchParamsState}
      />

      {/* Main Content Area */}
      <main className="flex-1 p-4">
        <h1 className="text-2xl font-bold mb-4">Items and Services</h1>
        <Listings
          type={searchParamsState.type || "all"}
          query={searchParamsState.query || ""}
          filters={searchParamsState}
        />
      </main>
    </div>
  );
};

export default LoggedHomePage;
