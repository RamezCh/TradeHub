// src/pages/ListingPage.jsx
import { useEffect } from "react";
import { useParams } from "react-router-dom";
import { useListingStore } from "../store/useListingStore";
import ListingCard from "../components/Listing/ListingCard";
import SellerInfo from "../components/Listing/SellerInfo";
import ListingSkeleton from "../components/skeletons/ListingSkeleton";
import ListingInfo from "../components/Listing/ListingInfo";
import SimilarAds from "../components/shared/SimilarAds";

const ListingPage = () => {
  const { listingId } = useParams();
  const { listing, isLoadingListing, fetchListingById } = useListingStore();

  useEffect(() => {
    fetchListingById(listingId);
  }, [listingId, fetchListingById]);

  if (isLoadingListing || !listing) {
    return <ListingSkeleton />;
  }

  const {
    providerFirstName,
    providerLastName,
    providerUsername,
    providerProfileImg,
    providerCreatedAt,
    title,
    createdAt,
    images,
    status,
    description,
    condition,
    location,
    category,
    type,
    _id: doNotMatchID,
  } = listing;

  return (
    <div className="container mx-auto p-6">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Listing Card */}
        <div className="lg:col-span-2">
          <ListingCard
            title={title}
            createdAt={createdAt}
            images={images}
            status={status}
          />
        </div>

        {/* Seller Information */}
        <div className="lg:col-span-1">
          <SellerInfo
            firstName={providerFirstName}
            lastName={providerLastName}
            profileImg={providerProfileImg}
            createdAt={providerCreatedAt}
            username={providerUsername}
          />
        </div>
      </div>

      {/* Listing Details */}
      <div className="mt-6">
        <ListingInfo
          description={description}
          condition={condition}
          category={category}
          location={location}
        />
      </div>

      {/* Similar Ads */}
      <div className="mt-6">
        <SimilarAds
          category={category}
          type={type}
          doNotMatchID={doNotMatchID}
        />
      </div>
    </div>
  );
};

export default ListingPage;
