import { useState, useEffect } from "react";
import PriceRange from "./PriceRange";
import RadioButton from "./RadioButton";
import Dropdown from "./Dropdown";
import { useLocationStore } from "../../store/useLocationStore";
import { useCategoryStore } from "../../store/useCategoryStore";

const FilterSidebar = () => {
  const { isLoadingLocation, locations, fetchLocations } = useLocationStore();
  const { isLoadingCategory, categories, fetchCategories } = useCategoryStore();

  const [selectedConditions, setSelectedConditions] = useState("");
  const [location, setLocation] = useState("");
  const [category, setCategory] = useState("");
  const [priceRange, setPriceRange] = useState({ min: 0, max: 1000 });
  const [paymentForm, setPaymentForm] = useState("");

  const handleConditionRadioChange = (selectedOption) =>
    setSelectedConditions(selectedOption);
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    name == "location" ? setLocation(value) : setCategory(value);
  };
  const handlePriceRangeChange = (selectedOption) =>
    setPriceRange(selectedOption);
  const handlePaymentFormChange = (selectedOption) =>
    setPaymentForm(selectedOption);

  useEffect(() => {
    fetchLocations();
    fetchCategories();
  }, [fetchLocations, fetchCategories]);

  const resetFilters = () => {
    setSelectedConditions("");
    setLocation("");
    setCategory("");
    setPriceRange({ min: 0, max: 1000 });
    setPaymentForm("");
  };

  return (
    <div className="bg-base-200 m-0 p-2">
      <div className="filter-sidebar p-4">
        {/* Filter by Conditions */}
        <div className="filter-section mb-4">
          <h3>Conditions</h3>
          <RadioButton
            name="conditions"
            options={["new", "old", "refurbished"]}
            selectedOption={selectedConditions}
            onChange={handleConditionRadioChange}
          />
        </div>

        {/* Filter by Location */}
        <div className="filter-section mb-4">
          <Dropdown
            label="Location"
            name="location"
            value={location}
            onChange={handleInputChange}
            options={
              isLoadingLocation
                ? [{ label: "Loading...", value: "" }]
                : locations.map((location) => ({
                    label: location.name,
                    value: location._id,
                  }))
            }
            required
          />
        </div>

        {/* Filter by Category */}
        <div className="filter-section mb-4">
          <Dropdown
            label="Category"
            name="category"
            value={category}
            onChange={handleInputChange}
            options={
              isLoadingCategory
                ? [{ label: "Loading...", value: "" }]
                : categories.map((category) => ({
                    label: category.name,
                    value: category._id,
                  }))
            }
            required
          />
        </div>

        {/* Filter by Price Range */}
        <div className="filter-section mb-4">
          <PriceRange
            min={0}
            max={1000}
            step={1}
            value={priceRange}
            onChange={handlePriceRangeChange}
          />
        </div>

        {/* Filter by Payment Form */}
        <div className="filter-section mb-4">
          <h3>Accepts Other Payment Form</h3>
          <RadioButton
            name="paymentForm"
            options={["Items", "Services", "Both", "None"]}
            selectedOption={paymentForm}
            onChange={handlePaymentFormChange}
          />
        </div>

        {/* Apply and Reset Buttons */}
        <div className="filter-section">
          <button className="apply-button mr-2">Apply</button>
          <button className="reset-button" onClick={resetFilters}>
            Reset
          </button>
        </div>
      </div>
    </div>
  );
};

export default FilterSidebar;
