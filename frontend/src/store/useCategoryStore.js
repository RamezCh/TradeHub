// store/useCategoryStore.js
import { create } from "zustand";
import { axiosInstance } from "../lib/axios.js";
import toast from "react-hot-toast";

export const useCategoryStore = create((set) => ({
  categories: [],
  isLoadingCategory: false,
  error: null,

  // Fetch categories
  fetchCategories: async () => {
    set({ isLoadingCategory: true, error: null });
    try {
      const response = await axiosInstance.get("/categories");
      set({ categories: response.data.categories });
    } catch (error) {
      set({ error: error.message });
      toast.error("Failed to load categories");
    } finally {
      set({ isLoadingCategory: false });
    }
  },

  // Create a category
  createCategory: async (name) => {
    set({ isLoadingCategory: true, error: null });
    try {
      const response = await axiosInstance.post("/categories", { name });
      set((state) => ({
        categories: [...state.categories, response.data.category],
      }));
      toast.success("Category created successfully!");
    } catch (error) {
      set({ error: error.message });
      toast.error("Failed to create category");
    } finally {
      set({ isLoadingCategory: false });
    }
  },

  // Rename a category
  renameCategory: async (id, name) => {
    set({ isLoadingCategory: true, error: null });
    try {
      const response = await axiosInstance.put(`/categories/${id}`, { name });
      set((state) => ({
        categories: state.categories.map((category) =>
          category._id === id ? response.data.category : category
        ),
      }));
      toast.success("Category renamed successfully!");
    } catch (error) {
      set({ error: error.message });
      toast.error("Failed to rename category");
    } finally {
      set({ isLoadingCategory: false });
    }
  },
}));
