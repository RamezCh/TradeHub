import { useParams } from "react-router-dom";
import { useAdminStore } from "../../store/useAdminStore.js";
import InputField from "../../components/shared/InputField.jsx";
import SingleImageInput from "../../components/shared/SingleImageInput.jsx";
import { useEffect, useState } from "react";
import { Loader } from "lucide-react";

const AdminUserProfile = () => {
  const { username } = useParams();
  const {
    isLoading,
    getUser,
    user,
    updateUser,
    isUpdating,
    deleteProfileImg,
    deleteCoverImg,
  } = useAdminStore();
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    profileImg: "",
    coverImg: "",
    email: "",
    username,
  });

  const [emailError, setEmailError] = useState("");

  useEffect(() => {
    getUser(username);
  }, [getUser, username]);

  useEffect(() => {
    if (user) {
      setFormData({
        firstName: user.firstName || "",
        lastName: user.lastName || "",
        profileImg: user.profileImg || "",
        coverImg: user.coverImg || "",
        email: user.email || "",
        username: user.username,
      });
    }
  }, [user]);

  const validateEmail = (email) => {
    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    return emailRegex.test(email);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({ ...prevData, [name]: value }));

    if (name === "email") {
      if (!validateEmail(value)) {
        setEmailError("Invalid email format");
      } else {
        setEmailError("");
      }
    }
  };

  const handleImageUpload = (name, imageUrl) => {
    setFormData((prevData) => ({ ...prevData, [name]: imageUrl }));
  };

  const handleDeleteProfileImg = () => {
    deleteProfileImg(username);
    setFormData((prevData) => ({ ...prevData, profileImg: "" }));
  };

  const handleDeleteCoverImg = () => {
    deleteCoverImg(username);
    setFormData((prevData) => ({ ...prevData, coverImg: "" }));
  };

  const handleSubmit = async () => {
    if (emailError) {
      alert("Please fix the email error before submitting.");
      return;
    }
    try {
      await updateUser(formData);
    } catch (error) {
      console.error("Failed to update user profile:", error);
    }
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <Loader className="size-10 animate-spin" />
      </div>
    );
  }

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-6">Admin User Profile</h1>
      <div className="space-y-6">
        <InputField
          label="First Name"
          name="firstName"
          type="text"
          value={formData.firstName}
          placeholder="Enter first name"
          onChange={handleInputChange}
        />
        <InputField
          label="Last Name"
          name="lastName"
          type="text"
          value={formData.lastName}
          placeholder="Enter last name"
          onChange={handleInputChange}
        />
        <div>
          <InputField
            label="E-mail"
            name="email"
            type="text"
            value={formData.email}
            placeholder="Enter your e-mail"
            onChange={handleInputChange}
          />
          {emailError && (
            <p className="text-red-500 text-sm mt-1">{emailError}</p>
          )}
        </div>
        <SingleImageInput
          label="Profile Image"
          imageUrl={formData.profileImg || "/default-profile-image.png"}
          onUpload={(imageUrl) => handleImageUpload("profileImg", imageUrl)}
          onRemove={handleDeleteProfileImg}
        />
        <SingleImageInput
          label="Cover Image"
          imageUrl={formData.coverImg || "/default-cover-image.jpg"}
          onUpload={(imageUrl) => handleImageUpload("coverImg", imageUrl)}
          onRemove={handleDeleteCoverImg}
        />
        <button
          className="btn btn-primary mt-4"
          onClick={handleSubmit}
          disabled={isUpdating || emailError}
        >
          {emailError
            ? "Check Email"
            : isUpdating
            ? "Updating..."
            : "Submit Changes"}
        </button>
      </div>
    </div>
  );
};

export default AdminUserProfile;
