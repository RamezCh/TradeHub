import express from "express";
import {
  getAdminDashboard,
  searchForUser,
} from "../controllers/admin.controller.js";
import { protectAdminRoute } from "../middleware/authMiddleware.js";

const router = express.Router();

router.get("/dashboard", protectAdminRoute, getAdminDashboard);
router.get("/users/search", protectAdminRoute, searchForUser);

export default router;
