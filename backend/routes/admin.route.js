import express from "express";
import {
  getAdminDashboard,
  searchForUser,
  updateUser,
  deleteProfileImg,
  deleteCoverImg,
  getLogs,
} from "../controllers/admin.controller.js";
import { protectAdminRoute } from "../middleware/authMiddleware.js";

const router = express.Router();

router.get("/dashboard", protectAdminRoute, getAdminDashboard);
router.get("/logs", protectAdminRoute, getLogs);
router.get("/users/search", protectAdminRoute, searchForUser);
router.put("/user/update", protectAdminRoute, updateUser);
router.delete("/user/delete/profileImg", protectAdminRoute, deleteProfileImg);
router.delete("/user/delete/coverImg", protectAdminRoute, deleteCoverImg);

export default router;
