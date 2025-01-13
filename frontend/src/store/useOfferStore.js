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
}));
