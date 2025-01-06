import User from "../models/User.js";
import Audit from "../models/Audit.js";
import Listing from "../models/Listing.js";
import { v2 as cloudinary } from "cloudinary";
import mongoose from "mongoose";

export const getAdminDashboard = async (req, res) => {
  try {
    const userCount = await User.countDocuments();
    const listingCount = await Listing.countDocuments();

    res.json({ userCount, listingCount });
  } catch (err) {
    console.error(err);
    res
      .status(500)
      .json({ message: "Error fetching data in Admin Controller" });
  }
};

export const searchForUser = async (req, res) => {
  try {
    const { search, type, page = 1, limit = 10 } = req.query;

    const query = {};

    if (search) {
      if (type == "firstName") {
        query.firstName = { $regex: search, $options: "i" };
      }

      if (type == "username") {
        query.username = { $regex: search, $options: "i" };
      }

      if (type == "id") {
        query._id = new mongoose.Types.ObjectId(search);
      }
    }

    query.isAdmin = false;

    const users = await User.find(query)
      .select("-password")
      .skip((page - 1) * limit)
      .limit(parseInt(limit));

    const totalUsers = await User.countDocuments(query);

    res.json({
      users,
      totalPages: Math.ceil(totalUsers / limit),
      currentPage: parseInt(page),
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Error searching for users" });
  }
};

export const updateUser = async (req, res) => {
  const { firstName, lastName, email, username } = req.body;
  let { profileImg, coverImg } = req.body;

  try {
    let user = await User.findOne({ username });
    if (!user) return res.status(404).json({ message: "User not found" });

    if (profileImg) {
      if (user.profileImg) {
        try {
          await cloudinary.uploader.destroy(
            user.profileImg.split("/").pop().split(".")[0]
          );
        } catch (error) {
          console.warn(
            "Cloudinary resource not found or already deleted:",
            error.message
          );
        }
      }
      const uploadedResponse = await cloudinary.uploader.upload(profileImg);
      profileImg = uploadedResponse.secure_url;
    }

    if (coverImg) {
      if (user.coverImg) {
        try {
          await cloudinary.uploader.destroy(
            user.coverImg.split("/").pop().split(".")[0]
          );
        } catch (error) {
          console.warn(
            "Cloudinary resource not found or already deleted:",
            error.message
          );
        }
      }
      const uploadedResponse = await cloudinary.uploader.upload(coverImg);
      coverImg = uploadedResponse.secure_url;
    }

    user.firstName = firstName || user.firstName;
    user.lastName = lastName || user.lastName;
    user.email = email || user.email;
    user.profileImg = profileImg || user.profileImg;
    user.coverImg = coverImg || user.coverImg;

    user = await user.save();

    return res.status(200).json(user);
  } catch (error) {
    console.error("Error in updateUser by Admin: ", error.message);
    res.status(500).json({ error: error.message });
  }
};

export const deleteProfileImg = async (req, res) => {
  const { username } = req.body;

  try {
    let user = await User.findOne({ username });
    if (!user) return res.status(404).json({ message: "User not found" });

    if (user.profileImg) {
      try {
        await cloudinary.uploader.destroy(
          user.profileImg.split("/").pop().split(".")[0]
        );
      } catch (error) {
        console.warn(
          "Cloudinary resource not found or already deleted:",
          error.message
        );
      }
    }
    user.profileImg = "";
    user = await user.save();
    res.status(200).json(user);
  } catch (error) {
    console.error("Error in deleteProfileImg by Admin: ", error.message);
    res.status(500).json({ error: error.message });
  }
};

export const deleteCoverImg = async (req, res) => {
  const { username } = req.body;

  try {
    let user = await User.findOne({ username });
    if (!user) return res.status(404).json({ message: "User not found" });

    if (user.coverImg) {
      try {
        await cloudinary.uploader.destroy(
          user.coverImg.split("/").pop().split(".")[0]
        );
      } catch (error) {
        console.warn(
          "Cloudinary resource not found or already deleted:",
          error.message
        );
      }
    }
    user.coverImg = "";
    user = await user.save();
    res.status(200).json(user);
  } catch (error) {
    console.error("Error in deletecoverImg by Admin: ", error.message);
    res.status(500).json({ error: error.message });
  }
};

export const getLogs = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;

    const skip = (page - 1) * limit;

    const logs = await Audit.find()
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .populate({
        path: "performedBy",
        select: "firstName lastName",
      });

    const totalLogs = await Audit.countDocuments();

    res.json({
      logs,
      totalLogs,
      totalPages: Math.ceil(totalLogs / limit),
      currentPage: page,
    });
  } catch (error) {
    console.error("Error in getLogs by Admin: ", error.message);
    res.status(500).json({ error: error.message });
  }
};
