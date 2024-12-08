import { generateTokenAndSetCookie } from "../lib/utils/generateToken.js";
import { v2 as cloudinary } from "cloudinary";
import User from "../models/User.js";
import bcrypt from "bcryptjs";

export const signup = async (req, res) => {
  try {
    const {
      firstName,
      lastName,
      username,
      email,
      password,
      bio,
      defaultPaymentMethod,
    } = req.body;

    let { profileImg, coverImg } = req.body;

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

    if (profileImg) {
      const result = await cloudinary.uploader.upload(profileImg);
      profileImg = result.secure_url;
    }

    if (coverImg) {
      const result = await cloudinary.uploader.upload(coverImg);
      coverImg = result.secure_url;
    }

    const newUser = new User({
      firstName,
      lastName,
      username,
      email,
      password: hashedPassword,
      bio: bio || "I am.. I sell.. I offer.. I am searching for..",
      profileImg: profileImg || "default-profile-image.png",
      coverImg: coverImg || "default-cover-image.png",
      defaultPaymentMethod: defaultPaymentMethod || "PayPal",
    });

    if (newUser) {
      await newUser.save();
      generateTokenAndSetCookie(newUser._id, res);

      res.status(201).json({
        _id: newUser._id,
        firstName: newUser.firstName,
        lastName: newUser.lastName,
        username: newUser.username,
        email: newUser.email,
        profileImg: newUser.profileImg,
        coverImg: newUser.coverImg,
        bio: newUser.bio,
        isAdmin: newUser.isAdmin,
        sellerStatus: newUser.sellerStatus,
        defaultPaymentMethod: newUser.defaultPaymentMethod,
        services: newUser.services,
        items: newUser.items,
        favProviders: newUser.favProviders,
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
    const { username, password } = req.body;
    const user = await User.findOne({ username });
    const isPasswordCorrect = await bcrypt.compare(
      password,
      user?.password || ""
    );

    if (!user || !isPasswordCorrect) {
      return res.status(400).json({ error: "Invalid username or password" });
    }

    generateTokenAndSetCookie(user._id, res);

    res.status(200).json({
      _id: user._id,
      firstName: user.firstName,
      lastName: user.lastName,
      username: user.username,
      email: user.email,
      profileImg: user.profileImg,
      coverImg: user.coverImg,
      bio: user.bio,
      isAdmin: user.isAdmin,
      sellerStatus: user.sellerStatus,
      defaultPaymentMethod: user.defaultPaymentMethod,
      services: user.services,
      items: user.items,
      favProviders: user.favProviders,
    });
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

export const getMe = async (req, res) => {
  try {
    const user = await User.findById(req.user._id).select("-password");
    res.status(200).json(user);
  } catch (error) {
    console.error("Error in getMe controller:", error.message);
    res.status(500).json({ error: "Internal Server Error" });
  }
};
