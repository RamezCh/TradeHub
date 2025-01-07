import express from "express";
import {
  getAdminDashboard,
  searchForUser,
  updateUser,
  deleteProfileImg,
  deleteCoverImg,
  getLogs,
  getPendingListings,
  setListingApprovalStatus,
} from "../controllers/admin.controller.js";
import { protectAdminRoute } from "../middleware/authMiddleware.js";

const router = express.Router();

router.get("/dashboard", protectAdminRoute, getAdminDashboard);
router.get("/logs", protectAdminRoute, getLogs);
router.get("/listings/pending", protectAdminRoute, getPendingListings);
router.put(
  "/listing/status/:listingId",
  protectAdminRoute,
  setListingApprovalStatus
);
router.get("/users/search", protectAdminRoute, searchForUser);
router.put("/user/update", protectAdminRoute, updateUser);
router.delete("/user/delete/profileImg", protectAdminRoute, deleteProfileImg);
router.delete("/user/delete/coverImg", protectAdminRoute, deleteCoverImg);

export default router;
