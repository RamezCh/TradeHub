import { create } from "zustand";
import { axiosInstance } from "../lib/axios.js";
import toast from "react-hot-toast";

export const useAdminStore = create((set) => ({
  userCount: 0,
  listingCount: 0,
  onlineUsersCount: 0,

  fetchDashboardData: async () => {
    try {
      const response = await axiosInstance.get("/admin/dashboard");
      set({
        userCount: response.data.userCount,
        listingCount: response.data.listingCount,
        onlineUsersCount: response.data.onlineUsersCount,
      });
    } catch (error) {
      toast.error("Error fetching dashboard data");
      console.log("Error fetching dashboard data:", error);
    }
  },
}));
