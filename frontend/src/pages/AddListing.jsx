import { useState } from "react";
import InputField from "../components/shared/InputField";
import Textarea from "../components/shared/Textarea";
import Dropdown from "../components/shared/Dropdown";
import ImageInput from "../components/shared/ImageInput";
import RadioButton from "../components/shared/RadioButton";

const AddListingPage = () => {
  const [formData, setFormData] = useState({
    seller: "",
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

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleImageUpload = (e) => {
    const files = Array.from(e.target.files);
    const urls = files.map((file) => URL.createObjectURL(file));
    setImageUrls([...imageUrls, ...urls]);
    setFormData({ ...formData, images: [...formData.images, ...files] });
  };

  const handleImageRemove = (index) => {
    const updatedImages = imageUrls.filter((_, i) => i !== index);
    setImageUrls(updatedImages);
    setFormData({ ...formData, images: updatedImages });
  };

  const handleRadioChange = (selectedOption) => {
    setFormData({ ...formData, acceptsOtherPaymentForm: selectedOption });
  };

  const handleSubmit = (e) => {
    e.preventDefault();

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

    console.log("Submitted Data", formData);
    setError("");
    alert("Listing added successfully!");
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
          required
        />

        <Textarea
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
            { label: "New", value: "New" },
            { label: "Used", value: "Used" },
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
