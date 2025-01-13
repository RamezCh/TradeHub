import Offer from "../models/Offer.js";
import Listing from "../models/Listing.js";
import User from "../models/User.js";
import Message from "../models/Message.js";
import { createNotification } from "../lib/createNotification.js";
import { createAudit } from "../lib/createAudit.js";

export const createOffer = async (req, res) => {
  const { listingId, receiver, details } = req.body;
  const type = req.body.type.toLowerCase();
  const sender = req.user._id;

  try {
    const listing = await Listing.findById(listingId);
    if (!listing) {
      return res.status(404).json({ message: "Listing not found" });
    }
    if (listing.status !== "available") {
      return res.status(400).json({ message: "Listing is not active" });
    }
    if (receiver.toString() === sender.toString()) {
      return res.status(400).json({ message: "You can't offer to yourself" });
    }

    const receiverUser = await User.findById(receiver);
    if (!receiverUser) {
      return res.status(404).json({ message: "Receiver not found" });
    }

    const existingOffer = await Offer.findOne({
      listingId,
      sender,
      receiver: receiverUser._id,
      type,
      status: "pending",
    });
    if (existingOffer) {
      return res.status(400).json({ message: "You already made an offer" });
    }

    const offer = new Offer({
      listingId,
      sender,
      receiver: receiverUser._id,
      type,
      details,
    });
    await offer.save();

    const senderUser = await User.findById(sender);

    await createNotification(
      receiver,
      "You have a new offer",
      "pending_offer",
      `/inbox/${senderUser.username}` // using chat because offers handled in chat
    );

    await Message.create({
      senderId: sender,
      receiverId: receiver,
      text: details,
      image: listing.images[0],
    });

    await createAudit(
      "Created",
      "offer",
      offer._id,
      sender,
      `Offer created by ${sender} for listing ${listing.title} to ${receiver}`
    );

    res.status(201).json(offer);
  } catch (error) {
    console.error("Error in createOffer: ", error.message);
    res.status(500).json({ error: error.message });
  }
};

export const replyToOffer = async (req, res) => {
  const { username } = req.params;
  const { status } = req.body;
  const receiver = req.user._id;

  const normalizedStatus = status.trim().toLowerCase();

  const validStatuses = ["accepted", "rejected", "cancelled", "completed"];
  if (!validStatuses.includes(normalizedStatus)) {
    return res.status(400).json({ message: "Invalid status" });
  }

  try {
    const sender = await User.findOne({ username });
    if (!sender) {
      return res.status(404).json({ message: "Sender not found" });
    }

    const offer = await Offer.findOne({
      sender: sender._id,
      receiver,
      status: "pending",
    });
    if (!offer) {
      return res.status(404).json({ message: "Offer not found" });
    }

    // Update offer status
    offer.status = normalizedStatus;
    await offer.save();

    const receiverUser = await User.findById(receiver);
    // Create notification
    await createNotification(
      sender._id,
      `Offer ${normalizedStatus}`,
      "offer_status_change",
      `/inbox/${receiverUser.username}`
    );

    // Create audit log
    await createAudit(
      "Edited",
      "offer",
      offer._id,
      receiver,
      `Offer ${normalizedStatus} by ${receiver} for listing ${offer.listingId} to ${sender.username}`
    );

    res.status(200).json(offer);
  } catch (error) {
    console.error("Error replying to offer:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};
