import express from "express";
import { protectRoute } from "../middleware/authMiddleware.js";
import {
  getNotification,
  getNotifications,
  markNotificationAsRead,
} from "../controllers/notification.controller.js";

const router = express.Router();

router.get("/", protectRoute, getNotifications);
router.get("/:id", protectRoute, getNotification);
router.put("/:id", protectRoute, markNotificationAsRead);

export default router;
