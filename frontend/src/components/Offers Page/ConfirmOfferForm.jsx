import { useState } from "react";
import { useOfferStore } from "../../store/useOfferStore";
import InputField from "../shared/InputField";
import QrScanner from "react-qr-scanner";

const ConfirmOfferForm = ({ offerId }) => {
  const [code, setCode] = useState("");
  const [showScanner, setShowScanner] = useState(false);
  const { confirmOffer } = useOfferStore();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await confirmOffer(offerId, code);
      setCode("");
    } catch (error) {
      console.error("Error confirming offer:", error);
    }
  };

  const handleScan = (data) => {
    if (data) {
      const scannedText = data.text || data;
      setCode(scannedText);
      setShowScanner(false);
    }
  };

  const handleError = (err) => {
    console.error("QR Code scan error:", err);
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
        <button
          type="button"
          className="btn btn-secondary w-full"
          onClick={() => setShowScanner(!showScanner)}
        >
          {showScanner ? "Close Scanner" : "Scan QR Code"}
        </button>
        {showScanner && (
          <QrScanner
            delay={300}
            onError={handleError}
            onScan={handleScan}
            style={{ width: "100%", height: "240px" }}
          />
        )}
      </form>
    </div>
  );
};

export default ConfirmOfferForm;
