import express from "express";
import { protectRoute } from "../middleware/authMiddleware.js";
import {
  getNotification,
  getNotifications,
  markNotificationAsRead,
} from "../controllers/notification.controller.js";

const router = express.Router();

router.get("/", protectRoute, getNotifications); // works, tested
router.get("/:id", protectRoute, getNotification); // works, tested
router.put("/:id", protectRoute, markNotificationAsRead); // works, tested

export default router;
