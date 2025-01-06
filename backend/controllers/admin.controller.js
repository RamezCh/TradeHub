import User from "../models/User.js";
import Listing from "../models/Listing.js";
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
