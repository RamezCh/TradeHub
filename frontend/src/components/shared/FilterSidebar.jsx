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
  };

  const botMargin = "mb-6";

  return (
    <div className="bg-base-200 mb-2 p-6 sticky top-0">
      {/* Filter by Conditions */}
      <div className={botMargin}>
        <h3>Conditions</h3>
        <RadioButton
          name="conditions"
          options={["new", "old", "refurbished"]}
          selectedOption={selectedConditions}
          onChange={handleConditionRadioChange}
        />
      </div>

      {/* Filter by Location */}
      <div className={botMargin}>
        <Dropdown
          label="Location"
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
        <Dropdown
          label="Category"
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
        <RadioButton
          label="Accepts Other Payment Form"
          name="paymentForm"
          options={["Items", "Services", "Both", "None"]}
          selectedOption={paymentForm}
          onChange={handlePaymentFormChange}
        />
      </div>

      {/* Apply and Reset Buttons */}
      <div className="flex flex-row justify-between">
        <button className="btn btn-primary" onClick={applyFilters}>
          Apply
        </button>
        <button className="btn btn-secondary" onClick={resetFilters}>
          Reset
        </button>
      </div>
    </div>
  );
};

export default FilterSidebar;
