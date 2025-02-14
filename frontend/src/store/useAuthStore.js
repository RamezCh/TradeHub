import { create } from "zustand";
import { axiosInstance } from "../lib/axios.js";
import toast from "react-hot-toast";
import { io } from "socket.io-client";

const BASE_URL =
  import.meta.env.MODE === "development" ? "http://localhost:5000" : "/";

export const useAuthStore = create((set, get) => ({
  authUser: null,
  isSigningUp: false,
  isLoggingIn: false,
  isResetingPassword: false,
  isUpdatingProfile: false,
  isCheckingAuth: true,
  onlineUsers: [],
  socket: null,
  lockTimeRemaining: null,

  checkAuth: async () => {
    try {
      const response = await axiosInstance.get("/auth/check");
      set({ authUser: response.data });
      get().connectSocket();
    } catch (error) {
      set({ authUser: null });
      console.log("Error in checkAuth:", error);
    } finally {
      set({ isCheckingAuth: false });
    }
  },

  signup: async (userData) => {
    try {
      set({ isSigningUp: true });
      const response = await axiosInstance.post("/auth/signup", userData);
      set({ authUser: response.data });
      toast.success("Account created successfully");
      get().connectSocket();
    } catch (error) {
      toast.error(error.response.data.error);
    } finally {
      set({ isSigningUp: false });
    }
  },

  becomeSeller: async (userData) => {
    try {
      set({ isSigningUp: true });
      const response = await axiosInstance.post(
        "/auth/become-seller",
        userData
      );
      set({ authUser: response.data });
      toast.success("Account successfully became a Seller");
      get().connectSocket();
    } catch (error) {
      toast.error(error.response.data.error);
    } finally {
      set({ isSigningUp: false });
    }
  },

  login: async (data) => {
    set({ isLoggingIn: true });
    try {
      const res = await axiosInstance.post("/auth/login", data);
      set({ authUser: res.data, lockTimeRemaining: null });
      toast.success("Logged in successfully");
      get().connectSocket();
    } catch (error) {
      if (error.response && error.response.data.lockUntil) {
        const lockUntil = new Date(error.response.data.lockUntil);
        const currentTime = new Date();
        const lockTimeRemaining = Math.max(
          0,
          Math.floor((lockUntil - currentTime) / 1000)
        );
        set({ lockTimeRemaining });
        console.log("lockTimeRemaining:", lockTimeRemaining);
        toast.error(error.response.data.error);
      } else {
        toast.error(error.response.data.error);
      }
    } finally {
      set({ isLoggingIn: false });
    }
  },

  logout: async () => {
    try {
      await axiosInstance.post("/auth/logout");
      set({ authUser: null });
      toast.success("Logged out successfully");
      get().disconnectSocket();
    } catch (error) {
      toast.error(error.response.data.message);
    }
  },

  updateProfile: async (data) => {
    set({ isUpdatingProfile: true });
    try {
      const res = await axiosInstance.put("/users/update", data);
      set({ authUser: res.data });
      toast.success("Profile updated successfully");
    } catch (error) {
      console.log("error in update profile:", error);
      toast.error(error.response.data.error);
    } finally {
      set({ isUpdatingProfile: false });
    }
  },

  forgotPassword: async (email) => {
    try {
      await axiosInstance.post("/auth/forgot-password", { email });
      toast.success("Password reset email sent");
    } catch (error) {
      toast.error(error.response.data.error);
    }
  },

  resetPassword: async (data) => {
    try {
      set({ isResetingPassword: true });
      await axiosInstance.post(`/auth/reset-password/${data.token}`, data);
      toast.success("Password reset successfully");
      return { success: true };
    } catch (error) {
      toast.error(error.response.data.error);
    } finally {
      set({ isResetingPassword: false });
    }
  },

  connectSocket: () => {
    const { authUser } = get();
    if (!authUser || get().socket?.connected) return;

    const socket = io(BASE_URL, {
      query: {
        userId: authUser._id,
      },
    });
    socket.connect();

    set({ socket: socket });

    socket.on("getOnlineUsers", (userIds) => {
      set({ onlineUsers: userIds });
    });
  },

  disconnectSocket: () => {
    if (get().socket?.connected) get().socket.disconnect();
  },
}));
