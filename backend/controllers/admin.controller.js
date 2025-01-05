import User from "../models/User.js";
import Listing from "../models/Listing.js";
import { io } from "../lib/socket.js";

export const getAdminDashboard = async (req, res) => {
  try {
    const userCount = await User.countDocuments();
    const listingCount = await Listing.countDocuments();
    const onlineUsersCount = io.engine.clientsCount;

    res.json({ userCount, listingCount, onlineUsersCount });
  } catch (err) {
    console.error(err);
    res
      .status(500)
      .json({ message: "Error fetching data in Admin Controller" });
  }
};
