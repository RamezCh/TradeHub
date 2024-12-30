// store/useLocationStore.js
import { create } from "zustand";
import { axiosInstance } from "../lib/axios.js";
import toast from "react-hot-toast";

export const useLocationStore = create((set) => ({
  locations: [],
  isLoadingLocation: false,
  error: null,

  // Fetch locations
  fetchLocations: async () => {
    set({ isLoadingLocation: true, error: null });
    try {
      const response = await axiosInstance.get("/locations");
      set({ locations: response.data.locations });
    } catch (error) {
      set({ error: error.message });
      toast.error("Failed to load locations");
    } finally {
      set({ isLoadingLocation: false });
    }
  },

  // Create a location
  createLocation: async (name) => {
    set({ isLoadingLocation: true, error: null });
    try {
      const response = await axiosInstance.post("/locations", { name });
      set((state) => ({
        locations: [...state.locations, response.data.location],
      }));
      toast.success("Location created successfully!");
    } catch (error) {
      set({ error: error.message });
      toast.error("Failed to create location");
    } finally {
      set({ isLoadingLocation: false });
    }
  },

  // Rename a location
  renameLocation: async (id, name) => {
    set({ isLoadingLocation: true, error: null });
    try {
      const response = await axiosInstance.put(`/locations/${id}`, { name });
      set((state) => ({
        locations: state.locations.map((location) =>
          location._id === id ? response.data.location : location
        ),
      }));
      toast.success("Location renamed successfully!");
    } catch (error) {
      set({ error: error.message });
      toast.error("Failed to rename location");
    } finally {
      set({ isLoadingLocation: false });
    }
  },
}));
