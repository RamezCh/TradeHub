import { useState, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import PriceRange from "./PriceRange";
import RadioButton from "./RadioButton";
import Dropdown from "./Dropdown";
import { useLocationStore } from "../../store/useLocationStore";
import { useCategoryStore } from "../../store/useCategoryStore";

const FilterSidebar = () => {
  const { isLoadingLocation, locations, fetchLocations } = useLocationStore();
  const { isLoadingCategory, categories, fetchCategories } = useCategoryStore();
  const [searchParams, setSearchParams] = useSearchParams();

  const [selectedConditions, setSelectedConditions] = useState("");
  const [location, setLocation] = useState("");
  const [category, setCategory] = useState("");
  const [priceRange, setPriceRange] = useState({ min: 0, max: 1000 });
  const [paymentForm, setPaymentForm] = useState("");
  const [isMobileFiltersOpen, setIsMobileFiltersOpen] = useState(false);

  const handleConditionRadioChange = (selectedOption) =>
    setSelectedConditions(selectedOption);
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    name === "location" ? setLocation(value) : setCategory(value);
  };
  const handlePriceRangeChange = (selectedOption) =>
    setPriceRange(selectedOption);
  const handlePaymentFormChange = (selectedOption) =>
    setPaymentForm(selectedOption);

  useEffect(() => {
    fetchLocations();
    fetchCategories();
  }, [fetchLocations, fetchCategories]);

  const applyFilters = () => {
    const newSearchParams = new URLSearchParams(searchParams);

    // Update filter-related parameters
    if (priceRange.min !== null && priceRange.min !== 0) {
      newSearchParams.set("priceMin", priceRange.min.toString());
    } else {
      newSearchParams.delete("priceMin");
    }
    if (priceRange.max !== null && priceRange.max !== 1000) {
      newSearchParams.set("priceMax", priceRange.max.toString());
    } else {
      newSearchParams.delete("priceMax");
    }
    if (category) {
      newSearchParams.set("category", category);
    } else {
      newSearchParams.delete("category");
    }
    if (location) {
      newSearchParams.set("location", location);
    } else {
      newSearchParams.delete("location");
    }
    if (selectedConditions) {
      newSearchParams.set("condition", selectedConditions);
    } else {
      newSearchParams.delete("condition");
    }
    if (paymentForm) {
      newSearchParams.set("acceptsOtherPaymentForm", paymentForm);
    } else {
      newSearchParams.delete("acceptsOtherPaymentForm");
    }

    setSearchParams(newSearchParams);
    setIsMobileFiltersOpen(false); // Close filters after applying
  };

  const resetFilters = () => {
    setSelectedConditions("");
    setLocation("");
    setCategory("");
    setPriceRange({ min: 0, max: 1000 });
    setPaymentForm("");

    const newSearchParams = new URLSearchParams(searchParams);

    // Remove only filter-related parameters
    newSearchParams.delete("priceMin");
    newSearchParams.delete("priceMax");
    newSearchParams.delete("category");
    newSearchParams.delete("location");
    newSearchParams.delete("condition");
    newSearchParams.delete("acceptsOtherPaymentForm");

    setSearchParams(newSearchParams);
    setIsMobileFiltersOpen(false); // Close filters after resetting
  };

  const botMargin = "mb-6";

  return (
    <>
      {/* Mobile: Fixed "Open Filters" Button */}
      <div className="bg-base-200 p-4 z-50 md:hidden">
        <button
          className="btn btn-primary w-full"
          onClick={() => setIsMobileFiltersOpen(!isMobileFiltersOpen)}
        >
          {isMobileFiltersOpen ? "Close Filters" : "Open Filters"}
        </button>
      </div>

      {/* Filters Sidebar */}
      <div
        className={`bg-base-200 mb-2 p-6 sticky top-24 w-full md:w-80 lg:w-96 ${
          isMobileFiltersOpen
            ? "fixed inset-0 z-40 overflow-y-auto"
            : "hidden md:block"
        }`}
      >
        {/* Filter by Conditions */}
        <div className={botMargin}>
          <h3 className="text-lg font-semibold mb-2">Conditions</h3>
          <RadioButton
            name="conditions"
            options={["new", "used", "refurbished"]}
            selectedOption={selectedConditions}
            onChange={handleConditionRadioChange}
          />
        </div>

        {/* Filter by Location */}
        <div className={botMargin}>
          <h3 className="text-lg font-semibold mb-2">Location</h3>
          <Dropdown
            name="location"
            value={location}
            onChange={handleInputChange}
            options={
              isLoadingLocation
                ? [{ label: "Loading...", value: "" }]
                : [
                    { label: "Choose a Location", value: "" },
                    ...locations.map((location) => ({
                      label: location.name,
                      value: location._id,
                    })),
                  ]
            }
            required
          />
        </div>

        {/* Filter by Category */}
        <div className={botMargin}>
          <h3 className="text-lg font-semibold mb-2">Category</h3>
          <Dropdown
            name="category"
            value={category}
            onChange={handleInputChange}
            options={
              isLoadingCategory
                ? [{ label: "Loading...", value: "" }]
                : [
                    { label: "Choose a Category", value: "" },
                    ...categories.map((category) => ({
                      label: category.name,
                      value: category._id,
                    })),
                  ]
            }
            required
          />
        </div>

        {/* Filter by Price Range */}
        <div className={botMargin}>
          <PriceRange
            min={0}
            max={1000}
            step={1}
            value={priceRange}
            onChange={handlePriceRangeChange}
          />
        </div>

        {/* Filter by Payment Form */}
        <div className={botMargin}>
          <h3 className="text-lg font-semibold mb-2">Payment Form</h3>
          <RadioButton
            name="paymentForm"
            options={["Items", "Services", "Both", "None"]}
            selectedOption={paymentForm}
            onChange={handlePaymentFormChange}
          />
        </div>

        {/* Apply and Reset Buttons */}
        <div className="flex flex-col space-y-4 md:flex-row md:space-y-0 md:justify-between">
          <button
            className="btn btn-primary w-full md:w-auto"
            onClick={applyFilters}
          >
            Apply Filters
          </button>
          <button
            className="btn btn-secondary w-full md:w-auto"
            onClick={resetFilters}
          >
            Reset Filters
          </button>
        </div>
      </div>
    </>
  );
};

export default FilterSidebar;
