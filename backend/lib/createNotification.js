import { io } from "../lib/socket.js";
import Notification from "../models/Notification.js";

export const createNotification = async (userId, message, type, link) => {
  try {
    const newNotification = await Notification.create({
      user: userId,
      message,
      type,
      link,
    });
    const savedNotification = await newNotification.save();

    io.to(userId.toString()).emit("newNotification", savedNotification);
  } catch (error) {
    console.log("Error in createNotification function", error.message);
  }
};
