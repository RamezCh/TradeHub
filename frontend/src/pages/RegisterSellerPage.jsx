import { useState } from "react";
import PersonalInfo from "../components/Become a Seller/PersonalInfo";
import VerifyEmail from "../components/Become a Seller/VerifyEmail";
import { useAuthStore } from "../store/useAuthStore";
import { useVerificationStore } from "../store/useVerificationStore";

const SellerRegistration = () => {
  const [stepCount, setStepCount] = useState(1);
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    profileImg: null,
    coverImg: null,
    username: "",
    password: "",
    bio: "",
    email: "",
    languages: [],
    sellerStatus: true,
  });

  const { signup, authUser, becomeSeller } = useAuthStore();
  const { resendVerificationEmail, isVerified } = useVerificationStore();

  const handleNextStep = async () => {
    try {
      await signup(formData);
      setStepCount(2);
    } catch (error) {
      console.error("Signup failed:", error);
    }
  };

  const handleNextStepExistingUser = async () => {
    try {
      await becomeSeller(formData);
      setStepCount(2);
    } catch (error) {
      console.error("Signup failed:", error);
    }
  };

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
          setStepCount={handleNextStep}
          handleNextStepExistingUser={handleNextStepExistingUser}
          user={authUser}
        />
      )}
      {stepCount === 2 && (
        <VerifyEmail
          email={formData.email}
          resendVerificationEmail={resendVerificationEmail}
          isVerified={isVerified}
        />
      )}
    </div>
  );
};

export default SellerRegistration;
