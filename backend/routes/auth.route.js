import express from "express";
import {
  becomeSeller,
  checkAuth,
  login,
  logout,
  signup,
  forgotPassword,
  resetPassword,
} from "../controllers/auth.controller.js";
import { protectRoute } from "../middleware/authMiddleware.js";

const router = express.Router();

router.post("/signup", signup);
router.post("/become-seller", protectRoute, becomeSeller);
router.post("/login", login);
router.post("/logout", protectRoute, logout);
router.get("/check", protectRoute, checkAuth);
router.post("/forgot-password", forgotPassword);
router.post("/reset-password/:token", resetPassword);

export default router;
