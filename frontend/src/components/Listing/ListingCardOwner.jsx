import { Edit, Trash2, AlertCircle } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useListingStore } from "../../store/useListingStore";
import { useState } from "react";

const ListingCardOwner = ({ listing, onDelete }) => {
  const { deleteListing } = useListingStore();
  const navigate = useNavigate();

  // State to manage modal visibility
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleEditClick = () => {
    navigate(`/listing/edit/${listing._id}`);
  };

  const handleDeleteClick = async () => {
    try {
      await deleteListing(listing._id);
      onDelete(listing._id); // Call the onDelete callback passed from the parent to update the list
      setIsModalOpen(false); // Close modal after deletion
    } catch (error) {
      console.error("Error deleting listing:", error);
      alert("Failed to delete the listing.");
    }
  };

  return (
    <>
      {/* Confirmation Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 flex items-center justify-center z-50">
          <div className="modal modal-open">
            <div className="modal-box max-w-md w-full">
              <h2 className="text-xl font-semibold text-red-500 flex items-center">
                <AlertCircle className="w-5 h-5 mr-2" />
                Delete Listing
              </h2>
              <p className="text-gray-700 my-4">
                Are you sure you want to delete this listing? This action cannot
                be undone.
              </p>
              <div className="modal-action">
                <button className="btn btn-error" onClick={handleDeleteClick}>
                  Yes, Delete
                </button>
                <button
                  className="btn"
                  onClick={() => setIsModalOpen(false)} // Close modal without deletion
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Listing Card */}
      <div className="card w-64 bg-base-100 shadow-lg rounded-lg">
        <figure>
          <img
            src={listing.images[0]}
            alt={listing.title}
            className="w-full h-40 object-fill rounded-t-lg"
          />
        </figure>
        <div className="card-body p-4">
          <h2 className="card-title text-xl">
            {listing.title.slice(0, 20) + "..."}
          </h2>
          <p className="text-sm text-gray-600">
            {listing.description.slice(0, 50) + "..."}
          </p>

          <div className="flex items-center justify-between text-xs text-gray-500 mt-2">
            <span>Location: {listing.location}</span>
            <span>Category: {listing.category}</span>
          </div>

          <div className="card-actions justify-end mt-4">
            <button
              className="btn btn-secondary btn-sm"
              onClick={handleEditClick}
            >
              <Edit className="w-4 h-4 mr-2" />
              Edit
            </button>
            <button
              className="btn btn-error btn-sm"
              onClick={() => setIsModalOpen(true)} // Open modal when delete is clicked
            >
              <Trash2 className="w-4 h-4 mr-2" />
              Delete
            </button>
          </div>
        </div>
      </div>
    </>
  );
};

export default ListingCardOwner;
