import { useEffect } from "react";
import { useParams } from "react-router-dom";
import { useOfferStore } from "../store/useOfferStore";
import QRCode from "../components/Offers Page/QRCode.jsx";
import ConfirmOfferForm from "../components/Offers Page/ConfirmOfferForm.jsx";

const OfferConfirmationPage = () => {
  const { offerId } = useParams();
  const { isLoading, offer, codeToScan, getOffer } = useOfferStore();

  useEffect(() => {
    if (offerId) {
      getOffer(offerId);
    }
  }, [offerId, getOffer]);

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
        <p className="text-lg text-neutral-500 ml-4">
          Loading offer details...
        </p>
      </div>
    );
  }

  if (!offer) {
    return (
      <div className="flex justify-center items-center h-screen">
        <p className="text-lg text-neutral-500">Offer not found.</p>
      </div>
    );
  }

  if (
    offer.senderConfirmation?.confirmed &&
    offer.receiverConfirmation?.confirmed
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
        <section
          aria-labelledby="qr-code-heading"
          className="card bg-base-200 shadow-lg p-6"
        >
          <h2
            id="qr-code-heading"
            className="text-xl font-semibold text-secondary mb-4"
          >
            Scan this QR Code
          </h2>
          <p className="text-neutral-600 mb-4">
            Share this QR code with the other party to allow them to confirm the
            offer.
          </p>
          <div className="flex justify-center">
            <QRCode code={codeToScan} />
          </div>
        </section>

        {/* Confirmation Form Section */}
        <section
          aria-labelledby="confirmation-form-heading"
          className="flex flex-col justify-evenly bg-base-200 rounded-2xl shadow-lg p-6"
        >
          <h2
            id="confirmation-form-heading"
            className="text-xl font-semibold text-secondary mb-4"
          >
            Confirm Your Offer
          </h2>
          <p className="text-neutral-600 mb-4">
            Enter the confirmation code provided by the other party to finalize
            the offer.
          </p>
          <div className="w-full">
            <ConfirmOfferForm offerId={offerId} />
          </div>
        </section>
      </div>
    </div>
  );
};

export default OfferConfirmationPage;
