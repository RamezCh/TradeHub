import { generateTokenAndSetCookie } from "../lib/generateToken.js";
import User from "../models/User.js";
import bcrypt from "bcryptjs";
import crypto from "crypto";
import sendgridMail from "@sendgrid/mail";
import dotenv from "dotenv";

dotenv.config();

// Set up SendGrid API key
sendgridMail.setApiKey(process.env.SENDGRID_API_KEY);

export const signup = async (req, res) => {
  try {
    const { firstName, lastName, username, email, password, sellerStatus } =
      req.body;

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({ error: "Invalid email format" });
    }

    const existingUser = await User.findOne({ username });
    if (existingUser) {
      return res.status(400).json({ error: "Username is already taken" });
    }

    const existingEmail = await User.findOne({ email });
    if (existingEmail) {
      return res.status(400).json({ error: "Email is already taken" });
    }

    if (password.length < 6) {
      return res
        .status(400)
        .json({ error: "Password must be at least 6 characters long" });
    }

    const salt = await bcrypt.genSalt(12);
    const hashedPassword = await bcrypt.hash(password, salt);

    const verificationToken = crypto.randomBytes(32).toString("hex");

    const newUser = new User({
      firstName,
      lastName,
      username,
      email,
      password: hashedPassword,
      sellerStatus,
      verificationToken,
    });

    if (newUser) {
      await newUser.save();
      generateTokenAndSetCookie(newUser._id, res);

      const verificationLink = `${process.env.CORS_ORIGIN}/verify-email/${verificationToken}`;

      // Send email using SendGrid
      const msg = {
        to: email,
        from: process.env.SENDER_EMAIL,
        subject: "Verify Your Email",
        html: `<body style="font-family: 'Muli', sans-serif; font-size: 14px; color: #000000; margin: 0; padding: 0; background-color: #FFFFFF;">
  <div style="width: 100%; text-align: center;">
    <div style="width: 100%; padding: 20px;">
      <h1 style="font-family: 'Arial', sans-serif; color: #333;">TradeHub</h1>
      <p style="font-family: 'Arial', sans-serif; color: #333;">Thanks for signing up, ${firstName} ${lastName}!</p>
      <p style="font-family: 'Arial', sans-serif; color: #333;">Please verify your email address.</p>
      <a href="${verificationLink}" style="background-color: #ffbe00; border-radius: 6px; color: #000; padding: 12px 40px; text-decoration: none; font-size: 14px; display: inline-block;">Verify Email Now</a>
      <p><strong style="color: #ffbe00; font-family: 'Arial', sans-serif;">Thank you!</strong></p>
    </div>
  </div>
</body>
`,
      };

      await sendgridMail.send(msg);

      res.status(201).json({
        _id: newUser._id,
        firstName: newUser.firstName,
        lastName: newUser.lastName,
        username: newUser.username,
        email: newUser.email,
        sellerStatus: newUser.sellerStatus,
        message: "Signup successful! Verification email sent.",
      });
    } else {
      res.status(400).json({ error: "Invalid user data" });
    }
  } catch (error) {
    console.error("Error in signup controller:", error.message);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

export const login = async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    const isPasswordCorrect = await bcrypt.compare(
      password,
      user?.password || ""
    );

    if (!user || !isPasswordCorrect) {
      return res.status(400).json({
        error: "Invalid email or password",
      });
    }

    generateTokenAndSetCookie(user._id, res);

    const userInfo = {
      _id: user._id,
      firstName: user.firstName,
      lastName: user.lastName,
      username: user.username,
      email: user.email,
      sellerStatus: user.sellerStatus,
    };

    res.status(200).json(userInfo);
  } catch (error) {
    console.error("Error in login controller:", error.message);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

export const logout = async (req, res) => {
  try {
    res.cookie("jwt", "", { maxAge: 0 });
    res.status(200).json({ message: "Logged out successfully" });
  } catch (error) {
    console.error("Error in logout controller:", error.message);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

export const checkAuth = async (req, res) => {
  try {
    const user = await User.findById(req.user._id).select("-password");
    if (user) {
      res.status(200).json(user);
    } else {
      res.status(404).json({ error: "User not found" });
    }
  } catch (error) {
    console.error("Error in checkAuth controller:", error.message);
    res.status(500).json({ error: "Internal Server Error" });
  }
};
