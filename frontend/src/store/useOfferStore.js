import { create } from "zustand";
import { axiosInstance } from "../lib/axios.js";
import toast from "react-hot-toast";

export const useOfferStore = create((set) => ({
  isLoading: false,

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

  confirmOffer: async (offerId, code) => {
    set({ isLoading: true });
    try {
      const response = await axiosInstance.post(`/offers/${offerId}/confirm`, {
        code,
      });
      toast.success("Offer confirmed successfully");
      return response.data.offer;
    } catch (error) {
      toast.error(error?.response?.data?.message || "Internal server error");
      throw error;
    } finally {
      set({ isLoading: false });
    }
  },
}));
