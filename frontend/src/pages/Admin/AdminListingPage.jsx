import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import { useAdminStore } from "../../store/useAdminStore.js";
import TextArea from "../../components/shared/Textarea.jsx";
import {
  Loader,
  Edit,
  XCircle,
  CheckCircle,
  Image as ImageIcon,
} from "lucide-react";

const AdminListingPage = () => {
  const { listingId } = useParams();
  const {
    getListing,
    setListingApprovalStatus,
    isLoading,
    isUpdating,
    listing,
  } = useAdminStore();
  const [approvalStatus, setApprovalStatus] = useState("");
  const [rejectionReason, setRejectionReason] = useState("");
  const [isEditing, setIsEditing] = useState(false);

  // Fetch listing data when the component mounts or listingId changes
  useEffect(() => {
    getListing(listingId);
  }, [getListing, listingId]);

  // Handle form submission for updating approval status
  const handleSubmit = async (e) => {
    e.preventDefault();

    const data = {
      approvalStatus,
      ...(approvalStatus === "rejected" && { rejectionReason }),
    };

    await setListingApprovalStatus(listingId, data);
    setIsEditing(false);
  };

  // Handle status change in the form
  const handleStatusChange = (e) => {
    setApprovalStatus(e.target.value);
    if (e.target.value !== "rejected") {
      setRejectionReason("");
    }
  };

  // Show a loader if data is still loading or listing is not available
  if (isLoading || !listing) {
    return (
      <div className="flex justify-center items-center h-screen bg-neutral">
        <Loader className="size-12 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="p-8 bg-neutral min-h-screen">
      <div className="max-w-full mx-auto h-full">
        {/* Page Header */}
        <div className="text-center mb-12">
          <h1 className="text-5xl font-bold text-primary mb-4">
            {listing?.title}
          </h1>
        </div>

        {/* Split Layout: Information on Left, Images on Right */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 h-full">
          {/* Left Side: Listing Information */}
          <div className="bg-base-100 p-8 rounded-2xl shadow-2xl h-full flex flex-col">
            <h2 className="text-2xl font-bold text-base-content mb-6">
              Listing Information
            </h2>
            <p className="text-base-content/80 text-lg mb-8 flex-grow">
              {listing?.description}
            </p>

            {/* Current Approval Status */}
            <div className="mb-8">
              <span className="font-bold text-base-content text-xl">
                Current Status:
              </span>
              <span
                className={`ml-3 px-4 py-2 rounded-full text-lg font-semibold ${
                  listing?.approvalStatus === "approved"
                    ? "bg-success/20 text-success"
                    : listing?.approvalStatus === "rejected"
                    ? "bg-error/20 text-error"
                    : "bg-warning/20 text-warning"
                }`}
              >
                {listing?.approvalStatus}
              </span>
            </div>

            {/* Edit Approval Status */}
            {isEditing ? (
              <form onSubmit={handleSubmit}>
                <div className="mb-8">
                  <label className="block text-lg font-bold text-base-content mb-3">
                    Approval Status
                  </label>
                  <select
                    value={approvalStatus}
                    onChange={handleStatusChange}
                    className="select select-bordered w-full text-lg"
                  >
                    <option value="approved">Approved</option>
                    <option value="rejected">Rejected</option>
                  </select>
                </div>

                {/* Rejection Reason (if status is rejected) */}
                {approvalStatus === "rejected" && (
                  <div className="mb-8">
                    <TextArea
                      label="Rejection Reason"
                      name="rejectionReason"
                      value={rejectionReason}
                      onChange={(e) => setRejectionReason(e.target.value)}
                      placeholder="Provide a reason for rejection"
                      required={approvalStatus === "rejected"}
                      className="text-lg"
                    />
                  </div>
                )}

                {/* Submit and Cancel Buttons */}
                <div className="flex gap-4">
                  <button
                    type="submit"
                    className="btn btn-primary btn-lg gap-2"
                    disabled={isUpdating}
                  >
                    {isUpdating ? (
                      <Loader className="size-6 animate-spin" />
                    ) : (
                      <CheckCircle className="size-6" />
                    )}
                    {isUpdating ? "Updating..." : "Update Status"}
                  </button>
                  <button
                    type="button"
                    onClick={() => setIsEditing(false)}
                    className="btn btn-secondary btn-lg gap-2"
                  >
                    <XCircle className="size-6" />
                    Cancel
                  </button>
                </div>
              </form>
            ) : (
              <button
                onClick={() => setIsEditing(true)}
                className="btn btn-accent btn-lg gap-2"
                disabled={listing?.approvalStatus !== "pending"}
              >
                <Edit className="size-6" />
                Edit Approval Status
              </button>
            )}

            {/* Reminder to Be Fair and Not Bias */}
            <div className="mt-8 p-4 bg-base-200 rounded-lg text-base-content/80 text-sm">
              <p>
                <strong>Reminder:</strong> Please ensure your decision is fair,
                unbiased, and based on the listing&apos;s merits. Avoid any
                personal preferences or external influences.
              </p>
            </div>
          </div>

          {/* Right Side: Listing Images */}
          <div className="bg-base-100 p-8 rounded-2xl shadow-2xl h-full">
            <h2 className="text-2xl font-bold text-base-content mb-6">
              Listing Images
            </h2>
            {listing?.images && listing.images.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 h-full overflow-y-auto">
                {listing.images.map((image, index) => (
                  <div
                    key={index}
                    className="relative w-full h-96 rounded-lg overflow-hidden group hover:scale-105 transition-transform duration-300"
                  >
                    <img
                      src={image}
                      alt={`Listing ${index + 1}`}
                      className="w-full h-full object-contain"
                    />
                    <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                      <ImageIcon className="text-white size-8" />
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center bg-base-200 p-8 rounded-lg h-full">
                <ImageIcon className="size-12 text-secondary mb-4" />
                <p className="text-base-content/60 text-lg">
                  No images available for this listing.
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminListingPage;
