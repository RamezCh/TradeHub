import { useState, useEffect } from "react";
import { Camera, Trash, Eye, EyeOff, User, Lock } from "lucide-react";
import toast from "react-hot-toast";

const PersonalInfo = ({ formData, setFormData, setStepCount, user }) => {
  const [currentFormData, setFormDataState] = useState({
    firstName: user.firstName || formData.firstName || "",
    lastName: user.lastName || formData.lastName || "",
    bio: user.bio || formData.bio || "",
    username: user.username || formData.username || "",
    email: user.email || formData.email || "",
    password: user.password || formData.password || "",
    profileImg: user.profileImg || formData.profileImg || "",
    coverImg: user.coverImg || formData.coverImg || "",
    languages: user.languages || formData.languages || [],
  });
  const [showPassword, setShowPassword] = useState(false);
  const [formValid, setFormValid] = useState(false);

  useEffect(() => {
    const validateForm = () => {
      const isFormValid = user
        ? currentFormData.bio &&
          currentFormData.profileImg &&
          currentFormData.coverImg &&
          currentFormData.languages.length > 0
        : currentFormData.firstName &&
          currentFormData.lastName &&
          currentFormData.bio &&
          currentFormData.username &&
          currentFormData.email &&
          currentFormData.password &&
          currentFormData.confirmPassword &&
          currentFormData.profileImg &&
          currentFormData.coverImg &&
          currentFormData.languages.length > 0;

      setFormValid(isFormValid);
    };

    validateForm();
  }, [currentFormData, user]);

  const handleImageUpload = (e, setImage) => {
    const file = e.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => setImage(reader.result);
  };

  const handleLanguageAdd = (e) => {
    e.preventDefault();
    const language = document.getElementById("language").value;
    const proficiency = document.getElementById("proficiency").value;

    if (!language || !proficiency) {
      toast.error("Please select both language and proficiency before adding.");
      return;
    }

    if (currentFormData.languages.some((lang) => lang.name === language)) {
      document.getElementById("language-modal").close();
      toast.error("Language already exists in the list.");
      return;
    }

    const updatedLanguages = [
      ...currentFormData.languages,
      { name: language, level: proficiency },
    ];

    setFormDataState({ ...currentFormData, languages: updatedLanguages });
    setFormData({ ...currentFormData, languages: updatedLanguages });
    document.getElementById("language-modal").close();
  };

  const handleLanguageRemove = (index) => {
    const updatedLanguages = currentFormData.languages.filter(
      (_, i) => i !== index
    );
    setFormDataState({ ...currentFormData, languages: updatedLanguages });
    setFormData({ ...currentFormData, languages: updatedLanguages }); // Sync languages to parent component
  };

  const handleNameChange = (e) => {
    const { name, value } = e.target;
    setFormDataState((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleContinue = () => {
    const errors = [];
    if (!user) {
      if (!currentFormData.username.trim()) errors.push("Username is required");
      if (!currentFormData.firstName.trim())
        errors.push("First Name is required");
      if (!currentFormData.lastName.trim())
        errors.push("Last Name is required");
      if (!currentFormData.email.trim()) errors.push("Email is required");
      if (!/\S+@\S+\.\S+/.test(currentFormData.email))
        errors.push("Invalid email format");
      if (!currentFormData.password) errors.push("Password is required");
      if (currentFormData.password.length < 6)
        errors.push("Password must be at least 6 characters");
      if (!currentFormData.confirmPassword)
        errors.push("Confirm password is required");
      if (currentFormData.password !== currentFormData.confirmPassword)
        errors.push("Passwords do not match");
    }

    if (errors.length > 0) {
      errors.forEach((error) => toast.error(error));
      setFormValid(false);
      return;
    }
    setFormData(currentFormData);
    setStepCount();
  };

  return (
    <div className="p-4 max-w-4xl mx-auto">
      <h1 className="text-2xl font-bold mb-2">Personal Info</h1>
      <p className="text-gray-600 mb-4">
        Tell us a bit about yourself. This information will appear on your
        public profile, so that potential buyers can get to know you better.
      </p>
      <p className="text-sm text-red-500 mb-4">* Mandatory fields</p>
      <div className="divider w-3/4 mx-auto mb-6"></div>
      <form className="space-y-6">
        <div className="space-y-4">
          <label className="block font-medium">
            Full Name: <span className="text-red-500">*</span>
          </label>
          <div className="flex gap-4">
            <input
              type="text"
              name="firstName"
              value={currentFormData.firstName}
              onChange={handleNameChange}
              placeholder="First Name"
              className="input input-bordered w-full"
              disabled={user.firstName}
            />
            <input
              type="text"
              name="lastName"
              value={currentFormData.lastName}
              onChange={handleNameChange}
              placeholder="Last Name"
              className="input input-bordered w-full"
              disabled={user.lastName}
            />
          </div>
        </div>

        {/* Cover Image Section */}
        <div className="relative group">
          <img
            src={currentFormData.coverImg || "/cover.jpg"}
            alt="Cover"
            className="w-full h-48 object-cover rounded-xl"
          />
          <label
            htmlFor="cover-upload"
            className="absolute bottom-4 right-4 bg-gray-700 text-white p-2 rounded-full cursor-pointer group-hover:scale-110 transition-transform"
          >
            <Camera className="w-5 h-5" />
            <input
              type="file"
              id="cover-upload"
              className="hidden"
              accept="image/*"
              onChange={(e) =>
                handleImageUpload(e, (img) =>
                  setFormDataState({ ...currentFormData, coverImg: img })
                )
              }
            />
          </label>

          {/* Centered Profile Image */}
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
            <div className="relative">
              <img
                src={currentFormData.profileImg || "/avatar.png"}
                alt="Profile"
                className="w-32 h-32 rounded-full object-cover border-4 border-white"
              />
              <label
                htmlFor="avatar-upload"
                className="absolute bottom-2 right-2 bg-gray-700 text-white p-2 rounded-full cursor-pointer hover:scale-110 transition-transform"
              >
                <Camera className="w-5 h-5" />
                <input
                  type="file"
                  id="avatar-upload"
                  className="hidden"
                  accept="image/*"
                  onChange={(e) =>
                    handleImageUpload(e, (img) =>
                      setFormDataState({ ...currentFormData, profileImg: img })
                    )
                  }
                />
              </label>
            </div>
          </div>
        </div>

        {/* Bio Section */}
        <div className="space-y-4">
          <label className="block font-medium">
            Bio: <span className="text-red-500">*</span>
          </label>
          <textarea
            name="bio"
            value={currentFormData.bio}
            onChange={handleNameChange}
            placeholder="Tell us a bit about yourself"
            className="textarea textarea-bordered w-full"
          />
        </div>

        {/* Username */}
        <label className="label">
          <span className="label-text font-medium">Username</span>
        </label>
        <div className="relative">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <User className="size-5 text-base-content/40" />
          </div>
          <input
            type="text"
            className={`input input-bordered w-full pl-10`}
            placeholder="Username"
            disabled={user.username}
            value={currentFormData.username}
            onChange={(e) =>
              setFormDataState({ ...currentFormData, username: e.target.value })
            }
          />
        </div>

        {/* Email Section */}
        <div className="space-y-4">
          <label className="block font-medium">
            Email: <span className="text-red-500">*</span>
          </label>
          <input
            type="email"
            name="email"
            disabled={user.email}
            value={currentFormData.email}
            onChange={handleNameChange}
            placeholder="Your Email"
            className="input input-bordered w-full"
          />
        </div>

        {/* Password and Confirm Password */}
        <div className="flex justify-between mb-6">
          {/* Password */}
          <div className="form-control w-1/2 mr-2">
            <label className="label">
              <span className="label-text font-medium">Password</span>
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Lock className="size-5 text-base-content/40" />
              </div>
              <input
                disabled={user.password}
                type={showPassword ? "text" : "password"}
                className={`input input-bordered w-full pl-10`}
                placeholder="••••••••"
                value={currentFormData.password}
                onChange={(e) =>
                  setFormDataState({
                    ...currentFormData,
                    password: e.target.value,
                  })
                }
              />
            </div>
          </div>

          {/* Confirm Password */}
          <div className="form-control w-1/2 ml-2 mb-5">
            <label className="label">
              <span className="label-text font-medium">Confirm Password</span>
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Lock className="size-5 text-base-content/40" />
              </div>
              <input
                disabled={user.password}
                type={showPassword ? "text" : "password"}
                className={`input input-bordered w-full pl-10`}
                placeholder="••••••••"
                value={currentFormData.confirmPassword}
                onChange={(e) =>
                  setFormDataState({
                    ...currentFormData,
                    confirmPassword: e.target.value,
                  })
                }
              />
              <button
                type="button"
                className="absolute inset-y-0 right-0 pr-3 flex items-center"
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? (
                  <EyeOff className="size-5 text-base-content/40" />
                ) : (
                  <Eye className="size-5 text-base-content/40" />
                )}
              </button>
            </div>
          </div>
        </div>

        {/* Language Section */}
        <div className="space-y-4">
          <label className="block font-medium">
            Languages: <span className="text-red-500">*</span>
          </label>
          <button
            type="button"
            className="btn btn-primary"
            onClick={() =>
              document.getElementById("language-modal").showModal()
            }
          >
            Add New Language
          </button>

          {/* Display Languages in Table */}
          {currentFormData.languages.length > 0 && (
            <div className="overflow-x-auto mt-4">
              <table className="table table-auto w-full">
                <thead>
                  <tr>
                    <th>Language</th>
                    <th>Proficiency</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {currentFormData.languages.map((lang, index) => (
                    <tr key={index}>
                      <td>{lang.name}</td>
                      <td>{lang.level}</td>
                      <td>
                        <button
                          className="btn btn-sm btn-danger"
                          onClick={() => handleLanguageRemove(index)}
                        >
                          <Trash className="w-4 h-4" />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* Modal for Adding Languages */}
        <dialog id="language-modal" className="modal">
          <div className="modal-box">
            <h3 className="font-bold text-lg mb-4">Add a New Language</h3>
            <select
              id="language"
              className="select select-bordered w-full mb-4"
            >
              <option>Arabic</option>
              <option>German</option>
              <option>English</option>
              <option>Spanish</option>
              <option>French</option>
            </select>
            <select
              id="proficiency"
              className="select select-bordered w-full mb-4"
            >
              <option>Native</option>
              <option>Fluent</option>
              <option>Intermediate</option>
              <option>Beginner</option>
            </select>
            <div className="modal-action">
              <button className="btn" onClick={handleLanguageAdd}>
                Add
              </button>
              <button
                className="btn"
                onClick={() =>
                  document.getElementById("language-modal").close()
                }
              >
                Cancel
              </button>
            </div>
          </div>
        </dialog>
      </form>

      <div className="mt-4">
        <button
          className={`btn ${formValid ? "btn-success" : "btn-disabled"}`}
          disabled={!formValid}
          onClick={handleContinue}
        >
          Continue
        </button>
      </div>
    </div>
  );
};

export default PersonalInfo;
