import ListingCard from "../components/Listing/ListingCard";
import SellerInfo from "../components/Listing/SellerInfo";
import ListingSkeleton from "../components/skeletons/ListingSkeleton";
import { useParams } from "react-router-dom";
import { useEffect } from "react";
import { useListingsStore } from "../store/useListingStore";

const ListingPage = () => {
  const { listingId } = useParams();
  const { listing, isLoadingListing, fetchListingById } = useListingsStore();
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
  } = listing || {};

  useEffect(() => {
    fetchListingById(listingId);
  }, [listingId, fetchListingById]);

  useEffect(() => {}, [listing]);

  return isLoadingListing || !listing ? (
    <ListingSkeleton />
  ) : (
    <>
      <div className="container mx-auto p-6 pt-24">
        <SellerInfo
          firstName={providerFirstName}
          lastName={providerLastName}
          profileImg={providerProfileImg}
          createdAt={providerCreatedAt}
          username={providerUsername}
        />
        <ListingCard
          title={title}
          createdAt={createdAt}
          images={images}
          status={status}
        />
      </div>
    </>
  );
};

export default ListingPage;
