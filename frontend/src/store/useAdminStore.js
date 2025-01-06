import { create } from "zustand";
import { axiosInstance } from "../lib/axios.js";
import toast from "react-hot-toast";

export const useAdminStore = create((set, get) => ({
  userCount: 0,
  listingCount: 0,
  users: [],
  user: null,
  totalPages: 0,
  currentPage: 1,
  isLoading: false,
  searchTerm: "",
  searchType: "",
  isUpdating: false,
  logs: [],

  getDashboardData: async () => {
    try {
      set({ isLoading: true });
      const response = await axiosInstance.get("/admin/dashboard");
      set({
        userCount: response.data.userCount,
        listingCount: response.data.listingCount,
      });
    } catch (error) {
      toast.error("Error fetching dashboard data");
      console.log("Error fetching dashboard data:", error);
    } finally {
      set({ isLoading: false });
    }
  },

  getUsers: async (page = 1, limit = 8) => {
    try {
      set({ isLoading: true });
      const searchTerm = get().searchTerm;
      const searchType = get().searchType;
      const response = await axiosInstance.get("/admin/users/search", {
        params: { page, limit, search: searchTerm, type: searchType },
      });
      set({
        users: response.data.users,
        totalPages: response.data.totalPages,
        currentPage: response.data.currentPage,
      });
    } catch (error) {
      set({ error: "Error fetching users" });
      console.error("Error fetching users:", error);
    } finally {
      set({ isLoading: false });
    }
  },

  getUser: async (username) => {
    try {
      set({ isLoading: true });
      const response = await axiosInstance.get(`/users/profile/${username}`);
      set({ user: response.data });
    } catch (error) {
      toast.error("Error fetching user");
      console.error("Error fetching user:", error);
    } finally {
      set({ isLoading: false });
    }
  },

  updateUser: async (data) => {
    set({ isUpdating: true });
    try {
      const res = await axiosInstance.put("/admin/user/update", data);
      set({ user: res.data });
      toast.success("User updated successfully");
    } catch (error) {
      console.log("error in update user:", error);
      toast.error(error.response.data.error);
    } finally {
      set({ isUpdating: false });
    }
  },

  deleteProfileImg: async (username) => {
    try {
      await axiosInstance.delete(`/admin/user/delete/profileImg`, {
        data: { username },
      });
      toast.success("Profile image deleted successfully");
    } catch (error) {
      console.error("Error deleting profile image:", error);
      toast.error("Error deleting profile image");
    }
  },

  deleteCoverImg: async (username) => {
    try {
      await axiosInstance.delete(`/admin/user/delete/coverImg`, {
        data: { username },
      });
      toast.success("Cover image deleted successfully");
    } catch (error) {
      console.error("Error deleting cover image:", error);
      toast.error("Error deleting cover image");
    }
  },

  getLogs: async (limit = 10) => {
    try {
      set({ isLoading: true });
      const page = get().currentPage;
      const response = await axiosInstance.get("/admin/logs", {
        params: { page, limit },
      });

      set({
        logs: response.data.logs,
        totalPages: response.data.totalPages,
      });
    } catch (error) {
      toast.error("Error fetching logs");
      console.error("Error fetching logs:", error);
    } finally {
      set({ isLoading: false });
    }
  },

  setPage: (page) => set({ currentPage: page }),
  setSearchTermAndType: (term, type) =>
    set({ searchTerm: term, searchType: type }),
}));
