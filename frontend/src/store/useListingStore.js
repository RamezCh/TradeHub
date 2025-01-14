import { create } from "zustand";
import { axiosInstance } from "../lib/axios.js";
import toast from "react-hot-toast";

export const useListingStore = create((set) => ({
  services: null,
  items: null,
  listing: null,
  listings: null,
  totalListings: 0,
  totalListingsPages: 0,
  totalServices: 0,
  totalItems: 0,
  totalServicesPages: 0,
  totalItemsPages: 0,
  isLoadingItems: false,
  isLoadingServices: false,
  isLoadingListing: false,
  page: 1,
  limit: 5,
  error: null,

  fetchListings: async (page = 1, limit = 5, type) => {
    type === "service"
      ? set({ isLoadingServices: true, page, limit, type })
      : type === "item"
      ? set({ isLoadingItems: true, page, limit, type })
      : set({ isLoadingListings: true, page, limit, type });

    try {
      // Make API request with pagination and type filtering
      const response = await axiosInstance.get(`/listings`, {
        params: { page, limit, type },
      });

      const data = response.data;

      type === "service"
        ? set({
            services: data.listings,
            totalServices: data.totalListings,
            totalServicesPages: data.totalPages,
          })
        : type === "item"
        ? set({
            items: data.listings,
            totalItems: data.totalListings,
            totalItemsPages: data.totalPages,
          })
        : set({
            listings: data.listings,
            totalListings: data.totalListings,
            totalListingsPages: data.totalPages,
          });
    } catch (err) {
      set({ error: "Error fetching listings" });
      toast.error("Error fetching listings", err);
    } finally {
      type === "service"
        ? set({ isLoadingServices: false })
        : type === "item"
        ? set({ isLoadingItems: false })
        : set({ isLoadingListings: false });
    }
  },

  // Search Listings
  searchListings: async (page, limit, query) => {
    set({ isLoadingListings: true });
    console.log("searchListings", query);

    try {
      const response = await axiosInstance.get(`/listings/search`, {
        params: { page, limit, ...query },
      });
      const data = response.data;

      set({ listings: data.listings });
    } catch (err) {
      set({ error: "Error fetching listings" });
      toast.error("Error fetching listings", err);
    } finally {
      set({ isLoadingListings: false });
    }
  },

  // Action to fetch a listing by ID
  fetchListingById: async (id) => {
    set({ isLoadingListing: true });

    try {
      const response = await axiosInstance.get(`/listings/${id}`);
      const data = response.data;

      set({ listing: data.listing });
    } catch (err) {
      set({ error: "Error fetching listing" });
      toast.error("Error fetching listing", err);
    } finally {
      set({ isLoadingListing: false });
    }
  },

  // Action to fetch listings by provider ID with pagination
  fetchListingsByProvider: async (providerId, page = 1, limit = 10) => {
    set({ isLoadingListings: true });

    try {
      const response = await axiosInstance.get(
        `/listings/provider/${providerId}`,
        {
          params: { page, limit },
        }
      );
      const data = response.data;

      set({
        listings: data.listings,
        totalListings: data.pagination.totalListings,
        totalListingsPages: data.pagination.totalPages,
      });
    } catch (err) {
      set({ error: "Error fetching listings by provider" });
      toast.error("Error fetching listings by provider", err);
    } finally {
      set({ isLoadingListings: false });
    }
  },

  // Create Listing
  createListing: async (listing) => {
    try {
      const response = await axiosInstance.post("/listings/create", listing);
      const data = response.data;
      console.log(listing);
      toast.success(data.message);
      return data;
    } catch (err) {
      set({ error: "Error creating listing" });

      toast.error("Error creating listing", err);
    }
  },

  // Update Listing
  updateListing: async (id, listing) => {
    try {
      const response = await axiosInstance.put(`/listings/edit/${id}`, listing);
      const data = response.data;

      toast.success(data.message);
      return data;
    } catch (err) {
      set({ error: "Error updating listing" });
      toast.error("Error updating listing", err);
    }
  },

  // Get My Listings
  getMyListings: async () => {
    try {
      set({ isLoadingListing: true });
      const response = await axiosInstance.get("/listings/mine");
      const data = response.data;
      return data.listings;
    } catch (err) {
      set({ error: "Error fetching my listings" });
      toast.error("Error fetching my listings", err);
    } finally {
      set({ isLoadingListing: false });
    }
  },

  // Delete Listing
  deleteListing: async (id) => {
    try {
      const response = await axiosInstance.delete(`/listings/delete/${id}`);
      const data = response.data;

      toast.success(data.message);
      return data;
    } catch (err) {
      set({ error: "Error deleting listing" });
      toast.error("Error deleting listing", err);
    }
  },

  // Reset the error state
  resetError: () => set({ error: null }),
}));
