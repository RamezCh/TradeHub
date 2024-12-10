import express from "express";
import { protectRoute } from "../middleware/authMiddleware.js";
import { getOrders, getOffer } from "../controllers/offer.controller.js";

const router = express.Router();

// Get a specific order by id
router.get("/:id", protectRoute, getOffer); // works, tested

// Get orders for the logged in user
router.get("/", protectRoute, getOrders); // works, tested

export default router;
