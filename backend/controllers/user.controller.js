import bcrypt from "bcryptjs";
import { v2 as cloudinary } from "cloudinary";
import jwt from "jsonwebtoken";

// models
import Notification from "../models/Notification.js";
import User from "../models/User.js";

export const getUserProfile = async (req, res) => {
  const { username } = req.params;

  try {
    const user = await User.findOne({ username }).select("-password");
    if (!user) return res.status(404).json({ message: "User not found" });

    res.status(200).json(user);
  } catch (error) {
    console.log("Error in getUserProfile: ", error.message);
    res.status(500).json({ error: error.message });
  }
}; // tested, works

export const addToMyList = async (req, res) => {
  const { providerId } = req.body; // Extract providerId from request body
  const userId = req.user._id; // Get current user ID from auth middleware

  try {
    // Fetch the current user and the provider
    const user = await User.findById(userId);
    const provider = await User.findById(providerId);

    if (!user) return res.status(404).json({ message: "User not found" });
    if (!provider)
      return res.status(404).json({ message: "Provider not found" });

    // Check if the provider is already in the user's myList
    const isAlreadyAdded = user.myList.some(
      (item) => item.providerId.toString() === providerId
    );

    if (isAlreadyAdded) {
      return res
        .status(400)
        .json({ message: "Provider is already in your favorites" });
    }

    // Add the provider to myList
    user.myList.push({ providerId });
    await user.save();

    // Create a notification for the addition
    const notification = new Notification({
      user: providerId, // The provider gets notified
      message: `${user.firstName} ${user.lastName} added you to their favorites.`,
      type: "system_update", // Specify the notification type
    });
    await notification.save();

    res
      .status(200)
      .json({ message: "Provider added to your favorites successfully" });
  } catch (error) {
    console.error("Error in addToMyList: ", error.message);
    res.status(500).json({ error: error.message });
  }
};

export const removeFromMyList = async (req, res) => {
  const { providerId } = req.body; // Extract providerId from request body
  const userId = req.user._id; // Get current user ID from auth middleware

  try {
    // Fetch the current user and the provider
    const user = await User.findById(userId);
    const provider = await User.findById(providerId);

    if (!user) return res.status(404).json({ message: "User not found" });
    if (!provider)
      return res.status(404).json({ message: "Provider not found" });

    // Check if the provider exists in myList
    const initialLength = user.myList.length;
    user.myList = user.myList.filter(
      (item) => item.providerId.toString() !== providerId
    );

    if (initialLength === user.myList.length) {
      return res
        .status(404)
        .json({ message: "Provider not found in your favorites" });
    }

    // Save the updated user document
    await user.save();

    // No Notification, keep things stealthy lol

    res
      .status(200)
      .json({ message: "Provider removed from your favorites successfully" });
  } catch (error) {
    console.error("Error in removeFromMyList: ", error.message);
    res.status(500).json({ error: error.message });
  }
};

export const getMyList = async (req, res) => {
  const userId = req.user._id;

  try {
    const user = await User.findById(userId).select("myList");
    if (!user) return res.status(404).json({ message: "User not found" });

    // Check if empty
    if (user?.myList == undefined) {
      return res
        .status(404)
        .json({ message: "Favorite Providers list is empty" });
    }

    res.status(200).json(user.myList);
  } catch (error) {
    console.error("Error in getMyList: ", error.message);
    res.status(500).json({ error: error.message });
  }
}; // Tested on empty list, works. Test again on full list

export const updateUser = async (req, res) => {
  const {
    firstName,
    lastName,
    email,
    username,
    currentPassword,
    newPassword,
    bio,
  } = req.body;
  let { profileImg, coverImg } = req.body;

  const userId = req.user._id;

  try {
    let user = await User.findById(userId);
    if (!user) return res.status(404).json({ message: "User not found" });

    if (
      (!newPassword && currentPassword) ||
      (!currentPassword && newPassword)
    ) {
      return res.status(400).json({
        error: "Please provide both current password and new password",
      });
    }

    if (currentPassword && newPassword) {
      const isMatch = await bcrypt.compare(currentPassword, user.password);
      if (!isMatch)
        return res.status(400).json({ error: "Current password is incorrect" });
      if (newPassword.length < 6) {
        return res
          .status(400)
          .json({ error: "Password must be at least 6 characters long" });
      }

      const salt = await bcrypt.genSalt(12);
      user.password = await bcrypt.hash(newPassword, salt);
    }

    if (profileImg) {
      if (user.profileImg) {
        // https://res.cloudinary.com/dyfqon1v6/image/upload/v1712997552/zmxorcxexpdbh8r0bkjb.png
        await cloudinary.uploader.destroy(
          user.profileImg.split("/").pop().split(".")[0]
        );
      }

      const uploadedResponse = await cloudinary.uploader.upload(profileImg);
      profileImg = uploadedResponse.secure_url;
    }

    if (coverImg) {
      if (user.coverImg) {
        await cloudinary.uploader.destroy(
          user.coverImg.split("/").pop().split(".")[0]
        );
      }

      const uploadedResponse = await cloudinary.uploader.upload(coverImg);
      coverImg = uploadedResponse.secure_url;
    }

    user.firstName = firstName || user.firstName;
    user.lastName = lastName || user.lastName;
    user.email = email || user.email;
    user.username = username || user.username;
    user.bio = bio || user.bio;
    user.profileImg = profileImg || user.profileImg;
    user.coverImg = coverImg || user.coverImg;

    user = await user.save();

    // password should be null in response
    user.password = null;

    return res.status(200).json(user);
  } catch (error) {
    console.log("Error in updateUser: ", error.message);
    res.status(500).json({ error: error.message });
  }
}; // Tested, works, modify for other data from User Model later on

export const updatePaymentMethod = async (req, res) => {
  const { paymentMethod } = req.body;
  const userId = req.user._id;

  try {
    const user = await User.findById(userId);
    if (!user) return res.status(404).json({ message: "User not found" });

    if (user.defaultPaymentMethod === paymentMethod) {
      return res
        .status(400)
        .json({ message: "This payment method is already set as default" });
    }

    user.defaultPaymentMethod = paymentMethod;
    await user.save();

    res
      .status(200)
      .json({ message: "Default payment method updated successfully" });
  } catch (error) {
    console.error("Error in updatePaymentMethod: ", error.message);
    res.status(500).json({ error: error.message });
  }
}; // leave for end
