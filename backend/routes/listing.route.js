import express from "express";
import {
  createListing,
  editListing,
  setListingTraded,
  deleteListing,
  getAllListings,
} from "../controllers/listing.controller.js";

const router = express.Router();

// Define routes
router.post("/listings", createListing);
router.put("/listings/:id", editListing);
router.patch("/listings/:id/traded", setListingTraded);
router.delete("/listings/:id", deleteListing);
router.get("/listings", getAllListings);

export default router;
