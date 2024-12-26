import { create } from "zustand";
import { axiosInstance } from "../lib/axios.js";
import toast from "react-hot-toast";

export const useSearchListingsStore = create((set) => ({
  listings: null,
  totalListings: 0,
  totalPages: 0,
  isLoading: false,
  error: null,

  // Default search parameters
  searchParams: {
    query: "",
    page: 1,
    limit: 5,
    type: "all",
    priceMin: null,
    priceMax: null,
    category: "",
  },

  // Action to perform the search
  searchListings: async (params = {}) => {
    set({ isLoading: true, error: null });

    const finalParams = {
      ...useSearchListingsStore.getState().searchParams,
      ...params, // Merge provided params with default params
    };

    try {
      const response = await axiosInstance.get(`/listings/search`, {
        params: finalParams,
      });

      const data = response.data;

      set({
        listings: data.listings,
        totalListings: data.totalListings || data.listings.length,
        totalPages: Math.ceil(
          (data.totalListings || data.listings.length) / finalParams.limit
        ),
        searchParams: finalParams, // Update the search params state
      });
    } catch (err) {
      set({ error: "Error searching listings" });
      toast.error("Error searching listings", err.message);
    } finally {
      set({ isLoading: false });
    }
  },

  // Reset search results and parameters
  resetSearch: () =>
    set({
      listings: null,
      searchParams: {
        query: "",
        page: 1,
        limit: 5,
        type: "all",
        priceMin: null,
        priceMax: null,
        category: "",
      },
      error: null,
    }),
}));
