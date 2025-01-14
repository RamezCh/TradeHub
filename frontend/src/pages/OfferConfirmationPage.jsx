import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { axiosInstance } from "../lib/axios.js";
import QRCode from "../components/shared/QRCode.jsx";
import ConfirmOfferForm from "../components/shared/ConfirmOfferForm.jsx";

const OfferConfirmationPage = () => {
  const { offerId } = useParams();
  const [offer, setOffer] = useState(null);
  const [codeToScan, setCodeToScan] = useState("");

  useEffect(() => {
    const fetchOffer = async () => {
      try {
        const response = await axiosInstance.get(`/offers/${offerId}`);
        setOffer(response.data.offer);
        setCodeToScan(response.data.codeToScan);
      } catch (error) {
        console.error("Error fetching offer:", error);
      }
    };
    fetchOffer();
  }, [offerId]);

  if (!offer) {
    return (
      <div className="flex justify-center items-center h-screen">
        <p className="text-lg text-neutral-500">Loading offer details...</p>
      </div>
    );
  }

  if (
    offer.senderConfirmation.confirmed &&
    offer.receiverConfirmation.confirmed
  ) {
    return (
      <div className="flex justify-center items-center h-screen">
        <p className="text-lg text-neutral-500">
          This offer has already been confirmed by both parties.
        </p>
      </div>
    );
  }

  if (offer.status !== "accepted") {
    return (
      <div className="flex justify-center items-center h-screen">
        <p className="text-lg text-neutral-500">
          This offer has not been accepted yet.
        </p>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-6">
      <h1 className="text-3xl font-bold text-center text-primary mb-8">
        Offer Confirmation
      </h1>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* QR Code Section */}
        <div className="card bg-base-200 shadow-lg p-6">
          <h2 className="text-xl font-semibold text-secondary mb-4">
            Scan this QR Code
          </h2>
          <p className="text-neutral-600 mb-4">
            Share this QR code with the other party to allow them to confirm the
            offer.
          </p>
          <div className="flex justify-center">
            <QRCode code={codeToScan} />
          </div>
        </div>

        {/* Confirmation Form Section */}
        <div className="flex flex-col justify-evenly bg-base-200 rounded-2xl shadow-lg p-6">
          <h2 className="text-xl font-semibold text-secondary mb-4">
            Confirm Your Offer
          </h2>
          <p className="text-neutral-600 mb-4">
            Enter the confirmation code provided by the other party to finalize
            the offer.
          </p>
          <div className="w-full">
            <ConfirmOfferForm offerId={offerId} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default OfferConfirmationPage;
