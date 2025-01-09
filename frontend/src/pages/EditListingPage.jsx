import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import InputField from "../components/shared/InputField";
import TextArea from "../components/shared/TextArea";
import Dropdown from "../components/shared/Dropdown";
import ImageInput from "../components/shared/ImageInput";
import RadioButton from "../components/shared/RadioButton";
import { useLocationStore } from "../store/useLocationStore";
import { useCategoryStore } from "../store/useCategoryStore";
import { useListingStore } from "../store/useListingStore";

const EditListingPage = () => {
  const { listingId } = useParams();
  const navigate = useNavigate();
  const { listing, fetchListingById, updateListing } = useListingStore();
  const { locations, fetchLocations } = useLocationStore();
  const { categories, fetchCategories } = useCategoryStore();

  const [formData, setFormData] = useState({
    title: "",
    description: "",
    condition: "",
    type: "",
    category: "",
    location: "",
    price: "",
    images: [],
    acceptsOtherPaymentForm: "none",
  });

  const [imageUrls, setImageUrls] = useState([]);
  const [error, setError] = useState("");

  useEffect(() => {
    fetchCategories();
    fetchLocations();
    if (listingId) fetchListingById(listingId);
  }, [listingId, fetchCategories, fetchLocations, fetchListingById]);

  useEffect(() => {
    if (listing) {
      setFormData((prev) => ({
        ...prev,
        ...listing,
        category:
          categories.find((cat) => cat._id === listing.category)?._id || "",
        location:
          locations.find((loc) => loc._id === listing.location)?._id || "",
      }));
      setImageUrls(listing.images || []);
    }
  }, [listing, categories, locations]);

  const handleInputChange = (e) => {
    const { name, value, type } = e.target;
    setFormData({ ...formData, [name]: type === "number" ? +value : value });
  };

  const handleImageUpload = async (e) => {
    const files = Array.from(e.target.files);
    const newImages = await Promise.all(
      files.map(
        (file) =>
          new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.onload = () => resolve(reader.result);
            reader.onerror = reject;
            reader.readAsDataURL(file);
          })
      )
    );
    setImageUrls((prev) => [...prev, ...newImages]);
    setFormData((prev) => ({
      ...prev,
      images: [...prev.images, ...newImages],
    }));
  };

  const handleImageRemove = (index) => {
    setImageUrls((prev) => prev.filter((_, i) => i !== index));
    setFormData((prev) => ({
      ...prev,
      images: formData.images.filter((_, i) => i !== index),
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await updateListing(listingId, formData);
      navigate(`/listing/${listingId}`);
    } catch {
      setError("Error updating listing. Please try again.");
    }
  };

  return (
    <div className="container mx-auto p-8">
      <h1 className="text-2xl font-bold mb-4">Edit Listing</h1>
      <form className="space-y-4" onSubmit={handleSubmit}>
        {error && <p className="text-red-500">{error}</p>}

        <InputField
          label="Title"
          name="title"
          type="text"
          value={formData.title}
          onChange={handleInputChange}
          placeholder="Enter title"
          required
        />

        <TextArea
          label="Description"
          name="description"
          value={formData.description}
          onChange={handleInputChange}
          placeholder="Enter description"
          required
        />

        <Dropdown
          label="Condition"
          name="condition"
          value={formData.condition}
          onChange={handleInputChange}
          options={[
            { label: "New", value: "new" },
            { label: "Used", value: "used" },
            { label: "Refurbished", value: "refurbished" },
          ]}
          required
        />

        <Dropdown
          label="Type"
          name="type"
          value={formData.type}
          onChange={handleInputChange}
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
          options={categories.map((cat) => ({
            label: cat.name,
            value: cat._id,
          }))}
          required
        />

        <Dropdown
          label="Location"
          name="location"
          value={formData.location}
          onChange={handleInputChange}
          options={locations.map((loc) => ({
            label: loc.name,
            value: loc._id,
          }))}
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
          onChange={(selectedOption) =>
            setFormData({
              ...formData,
              acceptsOtherPaymentForm: selectedOption,
            })
          }
          direction="row"
        />

        <button type="submit" className="btn btn-primary w-full">
          Submit Changes
        </button>
      </form>
    </div>
  );
};

export default EditListingPage;
