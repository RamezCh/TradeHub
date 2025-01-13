import Notification from "../models/Notification.js";

export const getNotification = async (req, res) => {
  try {
    const notificationId = req.params.id;
    const userId = req.user._id;
    const notification = await Notification.findById(notificationId);

    if (!notification) {
      return res.status(404).json({ error: "Notification not found" });
    }

    if (notification.user.toString() !== userId.toString()) {
      return res
        .status(403)
        .json({ error: "Not authorized to view this notification" });
    }

    res.status(200).json(notification);
  } catch (error) {
    console.log("Error in getNotification function", error.message);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

export const getNotifications = async (req, res) => {
  try {
    const userId = req.user._id;
    const notifications = await Notification.find({
      user: userId,
      readStatus: false,
    }).sort({
      createdAt: -1,
    });

    if (!notifications) {
      return res.status(404).json({ error: "No notifications found" });
    }

    res.status(200).json(notifications);
  } catch (error) {
    console.log("Error in getNotifications function", error.message);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

export const markNotificationAsRead = async (req, res) => {
  try {
    const notificationId = req.params.id;
    const userId = req.user._id;
    const notification = await Notification.findById(notificationId);
    console.log("notification", notification);
    console.log("notificationId", notificationId);

    if (!notification) {
      return res.status(404).json({ error: "Notification not found" });
    }

    if (notification.user.toString() !== userId.toString()) {
      return res
        .status(403)
        .json({ error: "Not authorized to mark this notification as read" });
    }

    notification.readStatus = true;
    await notification.save();

    res.status(200).json({ message: "Notification marked as read" });
  } catch (error) {
    console.log("Error in markNotificationAsRead function", error.message);
    res.status(500).json({ error: "Internal Server Error" });
  }
};
