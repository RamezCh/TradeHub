import express from "express";
import { protectRoute } from "../middleware/authMiddleware.js";
import {
  createListing,
  editListing,
  toggleListingStatus,
  deleteListing,
  getAllListings,
  getListing,
  getListingsByProvider,
  searchListings,
  getMyListings,
} from "../controllers/listing.controller.js";

const router = express.Router();

// Define routes
router.post("/create", protectRoute, createListing); // does functionality, tested for one image, create multiple later on
router.put("/edit/:id", protectRoute, editListing); // does functionality, tested for one image, create multiple later on
router.patch("/toggle-status/:id", protectRoute, toggleListingStatus); // works 100% correct
router.delete("/delete/:id", protectRoute, deleteListing); // works 100% correct
router.get("/", getAllListings); // works 100% correct
router.get("/mine", protectRoute, getMyListings); // works 100% correct
router.get("/:id", getListing); // works 100% correct
router.get("/provider/:providerId", getListingsByProvider); // works 100% correct
router.get("/search", searchListings); // works 100% correct

export default router;
