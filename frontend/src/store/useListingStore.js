import { create } from "zustand";
import { axiosInstance } from "../lib/axios.js";
import toast from "react-hot-toast";

export const useListingsStore = create((set) => ({
  listings: [],
  totalListings: 0,
  totalPages: 0,
  page: 1,
  limit: 5,
  type: "all", // Default to 'all' types
  isLoadingListings: false,
  error: null,

  fetchListings: async (page = 1, limit = 5, type = "all") => {
    set({ isLoadingListings: true, page, limit, type });

    try {
      // Make API request with pagination and type filtering
      const response = await axiosInstance.get(`/listings`, {
        params: { page, limit, type },
      });

      const data = response.data;

      set({
        listings: data.listings,
        totalListings: data.totalListings,
        totalPages: data.totalPages,
      });
    } catch (err) {
      set({ error: "Error fetching listings" });
      toast.error("Error fetching listings", err);
    } finally {
      set({ isLoadingListings: false });
    }
  },

  // Action to fetch a listing by ID
  fetchListingById: async (id) => {
    set({ isLoadingListings: true });

    try {
      const response = await axiosInstance.get(`/listings/${id}`);
      const data = response.data;

      set({ listings: [data.listing] });
    } catch (err) {
      set({ error: "Error fetching listing" });
      toast.error("Error fetching listing", err);
    } finally {
      set({ isLoadingListings: false });
    }
  },

  // Action to fetch listings by provider ID
  fetchListingsByProvider: async (providerId) => {
    set({ isLoadingListings: true });

    try {
      const response = await axiosInstance.get(
        `/listings/provider/${providerId}`
      );
      const data = response.data;

      set({ listings: data.listings });
    } catch (err) {
      set({ error: "Error fetching listings by provider" });
      toast.error("Error fetching listings by provider", err);
    } finally {
      set({ isLoadingListings: false });
    }
  },

  // Reset the error state
  resetError: () => set({ error: null }),
}));
