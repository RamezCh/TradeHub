import express from "express";
import { protectRoute } from "../middleware/authMiddleware.js";
import {
  createOffer,
  replyToOffer,
  confirmOffer,
  getOffer,
} from "../controllers/offer.controller.js";

const router = express.Router();

// Create an offer
router.post("/create", protectRoute, createOffer); // works, tested

// Get offers for the logged in user
// router.get("/", protectRoute, getOffers); // works, tested

// Reply to an offer
router.put("/reply/:username", protectRoute, replyToOffer); // works, tested

// POST /offers/:offerId/confirm
router.post("/:offerId/confirm", protectRoute, confirmOffer);

router.get("/:offerId", protectRoute, getOffer);

export default router;
