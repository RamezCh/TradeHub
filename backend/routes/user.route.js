import express from "express";
import { protectRoute } from "../middleware/authMiddleware.js";
import {
  addToMyList,
  removeFromMyList,
  getUserProfile,
  updateUser,
} from "../controllers/user.controller.js";

const router = express.Router();

// Get user profile by username
router.get("/profile/:username", getUserProfile); // works, tested.

// Add a provider to myList by clicking heart icon
router.post("/myList/add/:providerId", protectRoute, addToMyList); // works 100%

// Remove a provider from myList (e.g., unclicking the heart icon)
router.delete("/myList/remove/:providerId", protectRoute, removeFromMyList); // works 100%

// Update user profile
router.put("/update", protectRoute, updateUser); // works

export default router;
