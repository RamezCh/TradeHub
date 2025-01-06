import { create } from "zustand";
import { axiosInstance } from "../lib/axios.js";
import toast from "react-hot-toast";

export const useAdminStore = create((set, get) => ({
  userCount: 0,
  listingCount: 0,
  users: [],
  totalPages: 0,
  currentPage: 1,
  isLoading: false,
  searchTerm: "",
  searchType: "",

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

  setPage: (page) => set({ currentPage: page }),
  setSearchTermAndType: (term, type) =>
    set({ searchTerm: term, searchType: type }),
}));
