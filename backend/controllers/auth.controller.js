import { generateTokenAndSetCookie } from "../lib/generateToken.js";
import User from "../models/User.js";
import bcrypt from "bcryptjs";
import crypto from "crypto";
import sendgridMail from "@sendgrid/mail";
import dotenv from "dotenv";
import cloudinary from "cloudinary";
import { createAudit } from "../lib/createAudit.js";
import { create } from "domain";

// Configure Cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

dotenv.config();

// Set up SendGrid API key
sendgridMail.setApiKey(process.env.SENDGRID_API_KEY);

export const signup = async (req, res) => {
  try {
    const {
      firstName,
      lastName,
      email,
      password,
      bio,
      sellerStatus = false,
      languages = [],
    } = req.body;

    let { profileImg, coverImg, username } = req.body;

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({ error: "Invalid email format" });
    }

    username = username?.toLowerCase();

    if (!username) {
      username = firstName.toLowerCase() + "." + lastName.toLowerCase();
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

    if (sellerStatus && (!languages || languages.length === 0)) {
      return res.status(400).json({
        error: "Sellers must provide at least one language.",
      });
    }

    const formattedLanguages = languages.map((lang) => ({
      name:
        lang.name.charAt(0).toUpperCase() + lang.name.slice(1).toLowerCase(),
      level: lang.level.toLowerCase(),
    }));

    if (profileImg) {
      await cloudinary.uploader.destroy(
        profileImg.split("/").pop().split(".")[0]
      );
      const uploadedResponse = await cloudinary.uploader.upload(profileImg);
      profileImg = uploadedResponse.secure_url;
    }

    if (coverImg) {
      await cloudinary.uploader.destroy(
        coverImg.split("/").pop().split(".")[0]
      );
      const uploadedResponse = await cloudinary.uploader.upload(coverImg);
      coverImg = uploadedResponse.secure_url;
    }

    const salt = await bcrypt.genSalt(12);
    const hashedPassword = await bcrypt.hash(password, salt);

    const verificationToken = crypto.randomBytes(32).toString("hex");

    const newUser = new User({
      firstName,
      lastName,
      username,
      email,
      bio,
      password: hashedPassword,
      sellerStatus,
      verificationToken,
      languages: sellerStatus ? formattedLanguages : [],
      profileImg: profileImg || "default-profile-image.png",
      coverImg: coverImg || "default-cover-image.png",
    });

    await newUser.save();
    generateTokenAndSetCookie(newUser._id, res);

    const verificationLink = `${process.env.CORS_ORIGIN}/verify-email/${verificationToken}`;

    const msg = {
      to: email,
      from: process.env.SENDER_EMAIL,
      subject: "Verify Your Email",
      html: `<p>Thanks for signing up, ${firstName} ${lastName}!</p>
             <p>Please verify your email address by clicking the link below:</p>
             <a href="${verificationLink}">Verify Email Now</a>`,
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
  } catch (error) {
    console.error("Error in signup controller:", error.message);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

export const becomeSeller = async (req, res) => {
  try {
    // Check if the user is authenticated
    if (!req.user || !req.user._id) {
      return res.status(401).json({ error: "User not authenticated" });
    }

    const {
      firstName,
      lastName,
      email,
      bio,
      sellerStatus = false,
      languages = [],
    } = req.body;

    let { profileImg, coverImg, username } = req.body;
    const userId = req.user._id;

    // Fetch the existing user
    const existingUser = await User.findById(userId);
    if (!existingUser) {
      return res.status(404).json({ error: "User not found" });
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({ error: "Invalid email format" });
    }

    // Check for an existing user with this username or email
    const existingUsername = await User.findOne({ username });
    if (
      existingUsername &&
      existingUsername._id.toString() !== userId.toString()
    ) {
      return res.status(400).json({ error: "Username is already taken" });
    }

    const existingEmail = await User.findOne({ email });
    if (existingEmail && existingEmail._id.toString() !== userId.toString()) {
      return res.status(400).json({ error: "Email is already taken" });
    }

    // Validate seller languages if sellerStatus is true
    if (sellerStatus && (!languages || languages.length === 0)) {
      return res.status(400).json({
        error: "Sellers must provide at least one language.",
      });
    }

    const formattedLanguages = languages.map((lang) => ({
      name:
        lang.name.charAt(0).toUpperCase() + lang.name.slice(1).toLowerCase(),
      level: lang.level.toLowerCase(),
    }));

    // Update profile image if provided
    if (profileImg) {
      try {
        // Extract image ID from the existing URL
        if (existingUser.profileImg) {
          const imageId = existingUser.profileImg
            .split("/")
            .pop()
            .split(".")[0];
          await cloudinary.uploader.destroy(imageId); // Destroy the old image
        }

        // Upload new image to Cloudinary
        const uploadedResponse = await cloudinary.uploader.upload(profileImg);
        profileImg = uploadedResponse.secure_url; // Use the new URL
      } catch (error) {
        console.error("Error uploading profile image:", error.message);
        return res.status(500).json({ error: "Profile image upload failed" });
      }
    }

    // Update cover image if provided
    if (coverImg) {
      try {
        // Extract image ID from the existing URL
        if (existingUser.coverImg) {
          const imageId = existingUser.coverImg.split("/").pop().split(".")[0];
          await cloudinary.uploader.destroy(imageId); // Destroy the old image
        }

        // Upload new image to Cloudinary
        const uploadedResponse = await cloudinary.uploader.upload(coverImg);
        coverImg = uploadedResponse.secure_url; // Use the new URL
      } catch (error) {
        console.error("Error uploading cover image:", error.message);
        return res.status(500).json({ error: "Cover image upload failed" });
      }
    }

    // Update user information in the database
    const updatedUser = await User.findByIdAndUpdate(
      userId,
      {
        firstName,
        lastName,
        username,
        email,
        bio,
        sellerStatus,
        languages: sellerStatus ? formattedLanguages : existingUser.languages,
        profileImg: profileImg || existingUser.profileImg,
        coverImg: coverImg || existingUser.coverImg,
      },
      { new: true }
    );

    // Respond with the updated user data
    res.status(200).json({
      _id: updatedUser._id,
      firstName: updatedUser.firstName,
      lastName: updatedUser.lastName,
      username: updatedUser.username,
      email: updatedUser.email,
      sellerStatus: updatedUser.sellerStatus,
      message: "User information updated successfully.",
    });
  } catch (error) {
    console.error("Error in update controller:", error.message);
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

    createAudit("Logged In", "user", user._id, user._id, "User logged in");

    const userInfo = {
      _id: user._id,
      firstName: user.firstName,
      lastName: user.lastName,
      username: user.username,
      email: user.email,
      profileImg: user.profileImg,
      coverImg: user.coverImg,
      bio: user.bio,
      sellerStatus: user.sellerStatus,
      languages: user.languages,
    };

    res.status(200).json(userInfo);
  } catch (error) {
    console.error("Error in login controller:", error.message);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

export const logout = async (req, res) => {
  try {
    await createAudit(
      "Logged Out",
      "user",
      req.user._id,
      req.user._id,
      "User logged out"
    );
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
      res.status(200).json({ ...user.toObject(), password: "1" });
    } else {
      res.status(404).json({ error: "User not found" });
    }
  } catch (error) {
    console.error("Error in checkAuth controller:", error.message);
    res.status(500).json({ error: "Internal Server Error" });
  }
};
