import { create } from "zustand";
import { axiosInstance } from "../lib/axios.js";
import toast from "react-hot-toast";

export const useVerificationStore = create((set) => ({
  verified: false,
  loading: true,
  verifyEmail: async (token) => {
    try {
      await axiosInstance.post("/verify-email", { token });
      set({ verified: true, loading: false });
    } catch (error) {
      console.error(error);
      set({ verified: false, loading: false });
    }
  },
  resendVerificationEmail: async () => {
    try {
      await axiosInstance.post("/verify-email/resend");
      toast.success("Verification email sent successfully.");
    } catch (error) {
      console.error(error);
      toast.error("Failed to send verification email. Please try again.");
    }
  },
}));
