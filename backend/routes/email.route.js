import express from "express";
import {
  verifyEmail,
  resendVerificationEmail,
  checkVerificationStatus,
} from "../controllers/email.controller.js";

const router = express.Router();

// Route to verify email
router.post("/", verifyEmail);

// Route to resend verification email
router.post("/resend", resendVerificationEmail);

// Route to check if email is verified
router.post("/isVerified", checkVerificationStatus);

export default router;
