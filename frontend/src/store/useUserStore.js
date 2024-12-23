import { create } from "zustand";
import { axiosInstance } from "../lib/axios.js";
import toast from "react-hot-toast";

export const useUserStore = create((set) => ({
  isLoadingProfile: false,
  userProfile: null,

  getUserProfile: async (username) => {
    set({ isLoadingProfile: true });
    try {
      const response = await axiosInstance.get(`/users/profile/${username}`);
      set({ userProfile: response.data });
    } catch (error) {
      console.log("Error in getUserProfile:", error);
      toast.error(error.response.data.message);
    } finally {
      set({ isLoadingProfile: false });
    }
  },
}));
