import { useState } from "react";
import PersonalInfo from "../components/Become a Seller/PersonalInfo";

const SellerRegistration = () => {
  const [stepCount, setStepCount] = useState(1);
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    profileImg: null,
    coverImg: null,
    bio: "",
    email: "",
    languages: [],
    sellerStatus: true,
  });

  return (
    <div className="p-4 max-w-4xl mx-auto">
      <div className="flex justify-center items-center flex-col">
        <ul className="steps w-full">
          <li className="step step-primary">Personal Information</li>
          <li className={`step ${stepCount > 1 ? "step-primary" : ""}`}>
            Account Security
          </li>
        </ul>
        <div className="divider w-3/4 mx-auto"></div>
      </div>
      {stepCount === 1 && (
        <PersonalInfo
          setFormData={setFormData}
          formData={formData}
          setStepCount={setStepCount}
        />
      )}
    </div>
  );
};

export default SellerRegistration;
