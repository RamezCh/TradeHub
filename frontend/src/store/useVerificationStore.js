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
  resendVerificationEmail: async (email) => {
    try {
      await axiosInstance.post("/verify-email/isVerified", { email });
      toast.success("Verification email sent successfully.");
    } catch (error) {
      console.error(error);
      toast.error("Failed to send verification email. Please try again.");
    }
  },
  isVerified: async (email) => {
    try {
      const response = await axiosInstance.post("/verify-email/isVerified", {
        email,
      });
      set({ verified: response.data.verified });
      console.log(response.data.verified);
      return response.data.verified;
    } catch (error) {
      console.error(error);
      return false;
    }
  },
}));
