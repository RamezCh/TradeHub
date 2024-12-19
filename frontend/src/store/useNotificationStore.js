import { create } from "zustand";
import { axiosInstance } from "../lib/axios.js";
import toast from "react-hot-toast";

export const useNotificationStore = create((set, get) => ({
  notifications: [],
  isFetchingNotifications: false,

  fetchNotifications: async () => {
    set({ isFetchingNotifications: true });
    try {
      const response = await axiosInstance.get("/notifications");
      set({ notifications: response.data });
    } catch (error) {
      console.error("Error fetching notifications:", error);
      toast.error("Failed to fetch notifications.");
    } finally {
      set({ isFetchingNotifications: false });
    }
  },

  markAsRead: async (notificationId) => {
    try {
      // console.log("Marking notification as read:", notificationId);
      await axiosInstance.put(`/notifications/${notificationId}`);
      const updatedNotifications = get().notifications.map((notification) =>
        notification._id === notificationId
          ? { ...notification, readStatus: true }
          : notification
      );
      set({ notifications: updatedNotifications });
    } catch (error) {
      console.error("Error marking notification as read:", error);
      toast.error("Failed to mark notification as read.");
    }
  },
}));
