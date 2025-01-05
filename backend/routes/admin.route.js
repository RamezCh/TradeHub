import express from "express";
import { getAdminDashboard } from "../controllers/admin.controller.js";
import { protectAdminRoute } from "../middleware/authMiddleware.js";

const router = express.Router();

router.get("/dashboard", protectAdminRoute, getAdminDashboard);

export default router;
