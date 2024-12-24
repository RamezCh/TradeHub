import express from "express";
import {
  createLocation,
  getLocations,
  renameLocation,
} from "../controllers/location.controller.js";
import { protectAdminRoute } from "../middleware/authMiddleware.js";

const router = express.Router();

router.post("/", protectAdminRoute, createLocation);
router.get("/", getLocations);
router.put("/:id", protectAdminRoute, renameLocation);

export default router;
