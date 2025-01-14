import { create } from "zustand";
import { axiosInstance } from "../lib/axios.js";
import toast from "react-hot-toast";

export const useOfferStore = create((set) => ({
  isLoading: false,
  offers: [],
  totalPages: 1,
  currentPage: 1,
  offer: null,
  codeToScan: "",

  createOffer: async (listingId, receiver, type, details) => {
    set({ isLoading: true });
    try {
      await axiosInstance.post("/offers/create", {
        listingId,
        receiver,
        type,
        details,
      });
      toast.success("Offer created successfully");
    } catch (error) {
      toast.error(error.message);
    } finally {
      set({ isLoading: false });
    }
  },

  replyToOffer: async (username, status) => {
    set({ isLoading: true });
    try {
      await axiosInstance.put(`/offers/reply/${username}`, {
        status,
      });

      toast.success("Offer replied to successfully");
    } catch (error) {
      toast.error(error?.message || "Internal server error");
      throw error;
    } finally {
      set({ isLoading: false });
    }
  },

  getOffers: async (status, page = 1, limit = 10) => {
    set({ isLoading: true });
    try {
      const response = await axiosInstance.get("/offers", {
        params: {
          status,
          page,
          limit,
        },
      });
      set({
        offers: response.data.data,
        totalPages: response.data.totalPages,
        currentPage: response.data.currentPage,
      });
    } catch (error) {
      toast.error(error?.response?.data?.message || "Internal server error");
      throw error;
    } finally {
      set({ isLoading: false });
    }
  },

  getOffer: async (offerId) => {
    set({ isLoading: true });
    try {
      const response = await axiosInstance.get(`/offers/${offerId}`);
      const { offer, codeToScan } = response.data;
      set({ offer });
      set({ codeToScan });
    } catch (error) {
      toast.error(error?.response?.data?.message || "Internal server error");
      throw error;
    } finally {
      set({ isLoading: false });
    }
  },

  confirmOffer: async (offerId, code) => {
    set({ isLoading: true });
    try {
      const response = await axiosInstance.post(`/offers/${offerId}/confirm`, {
        code,
      });
      toast.success("Offer confirmed successfully");
      set({ offer: response.data.offer });
    } catch (error) {
      toast.error(error?.response?.data?.message || "Internal server error");
      throw error;
    } finally {
      set({ isLoading: false });
    }
  },

  leaveReview: async (listingId, review) => {
    set({ isLoading: true });
    try {
      await axiosInstance.post(`/listings/review/${listingId}`, review);
      toast.success("Review submitted successfully");
    } catch (error) {
      toast.error(error?.response?.data?.message || "Internal server error");
      throw error;
    } finally {
      set({ isLoading: false });
    }
  },

  setCurrentPage: (page) => set({ currentPage: page }),
}));
