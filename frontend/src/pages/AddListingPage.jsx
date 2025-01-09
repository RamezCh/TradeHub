// pages/AddListingPage.js
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import InputField from "../components/shared/InputField";
import TextArea from "../components/shared/TextArea";
import Dropdown from "../components/shared/Dropdown";
import ImageInput from "../components/shared/ImageInput";
import RadioButton from "../components/shared/RadioButton";
import { useLocationStore } from "../store/useLocationStore";
import { useCategoryStore } from "../store/useCategoryStore";
import { useListingStore } from "../store/useListingStore";

const AddListingPage = () => {
  const [formData, setFormData] = useState({
    type: "item",
    title: "",
    description: "",
    images: [],
    condition: "New",
    location: "",
    category: "",
    price: "",
    acceptsOtherPaymentForm: "none", // Default to "none"
  });

  const [imageUrls, setImageUrls] = useState([]);
  const [error, setError] = useState("");

  const navigate = useNavigate();

  // Submit function
  const { createListing } = useListingStore();

  // Location and category store data
  const { locations, isLoadingLocation, fetchLocations } = useLocationStore();
  const { categories, isLoadingCategory, fetchCategories } = useCategoryStore();

  useEffect(() => {
    fetchLocations();
    fetchCategories();
  }, [fetchLocations, fetchCategories]);

  const handleInputChange = (e) => {
    const { name, value, type } = e.target;
    const parsedValue = type === "number" ? parseFloat(value) : value;
    setFormData({ ...formData, [name]: parsedValue });
  };

  const handleInputChangeWithLowerCase = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value.toLowerCase() });
  };

  const handleImageUpload = async (e) => {
    const files = Array.from(e.target.files);
    const newImageUrls = [];
    const newImagesBase64 = [];

    const convertFileToBase64 = (file) => {
      return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onloadend = () => {
          resolve(reader.result);
        };
        reader.onerror = reject;
        reader.readAsDataURL(file);
      });
    };

    const processImages = async () => {
      for (const file of files) {
        try {
          const base64Image = await convertFileToBase64(file);
          newImagesBase64.push(base64Image);
          newImageUrls.push(base64Image);

          if (newImageUrls.length === files.length) {
            setImageUrls((prev) => [...prev, ...newImageUrls]);
            setFormData((prev) => ({
              ...prev,
              images: [...prev.images, ...newImagesBase64],
            }));
          }
        } catch (error) {
          console.error("Error converting file to base64", error);
        }
      }
    };

    processImages();
  };

  const handleImageRemove = (index) => {
    const updatedImageUrls = imageUrls.filter((_, i) => i !== index); // Remove from preview URLs
    const updatedImages = formData.images.filter((_, i) => i !== index); // Remove from formData

    setImageUrls(updatedImageUrls);
    setFormData((prev) => ({
      ...prev,
      images: updatedImages, // Update formData with the new images
    }));
  };

  const handleRadioChange = (selectedOption) => {
    setFormData({ ...formData, acceptsOtherPaymentForm: selectedOption });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validate fields
    if (
      !formData.title ||
      !formData.description ||
      formData.images.length === 0
    ) {
      setError(
        "Please fill all required fields and upload at least one image."
      );
      return;
    }

    setError("");

    try {
      // Create listing
      const response = await createListing(formData);
      if (response) {
        const listingId = response.listing._id;

        // Redirect after 3 seconds
        setTimeout(() => {
          navigate(`/listing/${listingId}`);
        }, 3000);
      }
    } catch (error) {
      // Catch any errors and set the error message
      setError("Error creating listing. Please try again.", error);
    }
  };

  return (
    <div className="container mx-auto p-8">
      <h1 className="text-2xl font-bold mb-4">Add Listing</h1>
      <form className="space-y-4" onSubmit={handleSubmit}>
        {error && <p className="text-red-500">{error}</p>}

        <InputField
          label="Title"
          name="title"
          type="text"
          value={formData.title}
          onChange={handleInputChange}
          placeholder="Enter title"
          maxLength={100}
          required
        />

        <TextArea
          label="Description"
          name="description"
          value={formData.description}
          onChange={handleInputChange}
          placeholder="Enter description"
          maxLength={1000}
          required
        />

        <Dropdown
          label="Condition"
          name="condition"
          value={formData.condition}
          onChange={handleInputChangeWithLowerCase}
          options={[
            { label: "New", value: "new" },
            { label: "Used", value: "used" },
          ]}
          required
        />

        <Dropdown
          label="Type"
          name="type"
          value={formData.type}
          onChange={handleInputChangeWithLowerCase}
          options={[
            { label: "Item", value: "item" },
            { label: "Service", value: "service" },
          ]}
          required
        />

        <Dropdown
          label="Category"
          name="category"
          value={formData.category}
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

        <Dropdown
          label="Location"
          name="location"
          value={formData.location}
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

        <InputField
          label="Price"
          name="price"
          type="number"
          value={formData.price}
          onChange={handleInputChange}
          placeholder="Enter price"
        />

        <ImageInput
          imageUrls={imageUrls}
          onUpload={handleImageUpload}
          onRemove={handleImageRemove}
        />

        <RadioButton
          label="Accepts Other Payment Form"
          name="acceptsOtherPaymentForm"
          options={["Items", "Services", "Both", "None"]}
          selectedOption={formData.acceptsOtherPaymentForm}
          onChange={handleRadioChange}
          direction="row"
        />

        <button type="submit" className="btn btn-primary w-full">
          Submit Listing
        </button>
      </form>
    </div>
  );
};

export default AddListingPage;
