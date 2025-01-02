import User from "../models/User.js";
import crypto from "crypto";
import sendgridMail from "@sendgrid/mail";
import { createAudit } from "../lib/createAudit.js";

sendgridMail.setApiKey(process.env.SENDGRID_API_KEY);

export const verifyEmail = async (req, res) => {
  try {
    const { token } = req.body;

    const user = await User.findOne({ verificationToken: token });
    if (!user) {
      return res.status(400).json({ error: "Invalid or expired token" });
    }

    user.isEmailVerified = true;
    user.verificationToken = null;
    await user.save();

    await createAudit(
      "Verified",
      "user",
      user._id,
      user._id,
      "User verified email address"
    );
    res
      .status(200)
      .json({ verified: true, message: "Email verified successfully" });
  } catch (error) {
    console.error("Error in email verification:", error.message);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

export const resendVerificationEmail = async (req, res) => {
  try {
    const { email } = req.body;

    const user = await User.findOne({ email });

    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    if (user.isEmailVerified) {
      return res.status(400).json({ error: "Email is already verified" });
    }

    // Generate new verification token
    const verificationToken = crypto.randomBytes(32).toString("hex");
    user.verificationToken = verificationToken;
    await user.save();

    const verificationLink = `${process.env.CORS_ORIGIN}/verify-email/${verificationToken}`;

    const msg = {
      to: user.email,
      from: process.env.SENDER_EMAIL,
      subject: "Verify Your Email",
      html: `
        <body style="font-family: 'Muli', sans-serif; font-size: 14px; color: #000000; margin: 0; padding: 0; background-color: #FFFFFF;">
          <div style="text-align: center;">
            <div style="width: 100%; padding: 20px;">
              <h1 style="font-family: 'Arial', sans-serif; color: #333;">TradeHub</h1>
              <p style="font-family: 'Arial', sans-serif; color: #333;">Thanks for signing up, ${user.firstName} ${user.lastName}!</p>
              <p style="font-family: 'Arial', sans-serif; color: #333;">Please verify your email address.</p>
              <a href="${verificationLink}" style="background-color: #ffbe00; border-radius: 6px; color: #000; padding: 12px 40px; text-decoration: none; font-size: 14px; display: inline-block;">Verify Email Now</a>
              <p><strong style="color: #ffbe00; font-family: 'Arial', sans-serif;">Thank you!</strong></p>
            </div>
          </div>
        </body>
      `,
    };

    await sendgridMail.send(msg);

    res
      .status(200)
      .json({ message: "Verification email resent successfully!" });
  } catch (error) {
    console.error("Error in resendVerificationEmail:", error.message);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

export const checkVerificationStatus = async (req, res) => {
  try {
    const { email } = req.body;

    const user = await User.findOne({ email });
    if (user.isEmailVerified) {
      return res.status(200).json({ verified: true });
    }
    return res.status(200).json({ verified: false });
  } catch (error) {
    console.error(
      "Error in checking email verification status:",
      error.message
    );
    res.status(500).json({ error: "Internal Server Error" });
  }
};
