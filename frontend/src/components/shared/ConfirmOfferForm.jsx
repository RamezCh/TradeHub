import { useState } from "react";
import { useOfferStore } from "../../store/useOfferStore";
import InputField from "./InputField";

const ConfirmOfferForm = ({ offerId }) => {
  const [code, setCode] = useState("");
  const confirmOffer = useOfferStore((state) => state.confirmOffer);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await confirmOffer(offerId, code);
      setCode("");
    } catch (error) {
      console.error("Error confirming offer:", error);
    }
  };

  return (
    <div className="card bg-base-100 shadow-xl p-6 max-w-md mx-auto">
      <form onSubmit={handleSubmit} className="space-y-4">
        <InputField
          label="Confirmation Code"
          name="code"
          type="text"
          value={code}
          onChange={(e) => setCode(e.target.value)}
          placeholder="Enter confirmation code"
          maxLength={50}
          required
        />
        <button type="submit" className="btn btn-primary w-full">
          Confirm
        </button>
      </form>
    </div>
  );
};

export default ConfirmOfferForm;
