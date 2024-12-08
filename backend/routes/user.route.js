import express from "express";
import { protectRoute } from "../middleware/authMiddleware.js";
import {
  addToMyList,
  getMyList,
  removeFromMyList,
  getUserProfile,
  updateUser,
} from "../controllers/user.controller.js";

const router = express.Router();

// Get user profile by username
router.get("/profile/:username", getUserProfile); // works, tested.

// Get current user's myList
router.get("/myList", protectRoute, getMyList); // works on empty list, havent tested on non-empty lists

// Add a provider to myList by clicking heart icon
router.post("/myList/add/:providerId", protectRoute, addToMyList);

// Remove a provider from myList (e.g., unclicking the heart icon)
router.post("/myList/remove/:providerId", protectRoute, removeFromMyList);

// Update user profile
router.post("/update", protectRoute, updateUser); // works

export default router;
