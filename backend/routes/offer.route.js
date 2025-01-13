import express from "express";
import { protectRoute } from "../middleware/authMiddleware.js";
import {
  createOffer,
  getOffers,
  getOffer,
  replyToOffer,
} from "../controllers/offer.controller.js";

const router = express.Router();

// Create an offer
router.post("/create", protectRoute, createOffer); // works, tested

// Get offers for the logged in user
router.get("/", protectRoute, getOffers); // works, tested

// Reply to an offer
router.post("/:id/reply", protectRoute, replyToOffer); // works, tested

// Get a specific offer by id
router.get("/:id", protectRoute, getOffer); // works, tested

export default router;
