import bcrypt from "bcryptjs";
import { v2 as cloudinary } from "cloudinary";
// models
import User from "../models/User.js";

export const getUserProfile = async (req, res) => {
  const { username } = req.params;

  try {
    const user = await User.findOne({ username }).select("-password");
    if (!user) return res.status(404).json({ message: "User not found" });

    const userProfile = {
      firstName: user.firstName,
      lastName: user.lastName,
      email: user.email,
      profileImg: user.profileImg,
      coverImg: user.coverImg,
      bio: user.bio,
      sellerStatus: user.sellerStatus,
      rating: user.rating,
      languages: user.languages,
    };

    res.status(200).json(userProfile);
  } catch (error) {
    console.log("Error in getUserProfile: ", error.message);
    res.status(500).json({ error: error.message });
  }
}; // tested, works

export const addToMyList = async (req, res) => {
  const { providerId } = req.params;
  const type = req.body.type.toLowerCase();
  const userId = req.user._id;
  try {
    // Fetch the current user and the provider
    const user = await User.findById(userId);
    const provider = await User.findById(providerId);

    if (!user) return res.status(404).json({ message: "User not found" });
    if (!provider)
      return res.status(404).json({ message: "Provider not found" });

    if (user._id.toString() === provider._id.toString()) {
      return res
        .status(400)
        .json({ message: "You can't add yourself to your favorites" });
    }
    // Check if the provider is already in the user's favProviders
    const isAlreadyAdded = user.favProviders.some(
      (item) => item._id.toString() === providerId
    );

    if (isAlreadyAdded) {
      return res
        .status(400)
        .json({ message: "Provider is already in your favorites" });
    }

    // Add the provider to favProviders
    user.favProviders.push({ _id: provider._id, type });
    await user.save();

    res
      .status(200)
      .json({ message: "Provider added to your favorites successfully" });
  } catch (error) {
    console.error("Error in addToMyList: ", error.message);
    res.status(500).json({ error: error.message });
  }
};

export const removeFromMyList = async (req, res) => {
  const { providerId } = req.params;
  const userId = req.user._id;
  try {
    // Fetch the current user and the provider
    const user = await User.findById(userId);
    const provider = await User.findById(providerId);

    if (!user) return res.status(404).json({ message: "User not found" });
    if (!provider)
      return res.status(404).json({ message: "Provider not found" });

    // Check if the provider exists in myList
    const initialLength = user.favProviders.length;
    user.favProviders = user.favProviders.filter(
      (item) => item._id.toString() !== providerId
    );

    if (initialLength === user.favProviders.length) {
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
