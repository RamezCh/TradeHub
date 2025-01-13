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

export const getOffers = async (req, res) => {
  const userId = req.user._id;
  try {
    const offers = await Offer.find({ toUserId: userId });
    res.status(200).json(offers);
  } catch (error) {
    console.error("Error in getOffers: ", error.message);
    res.status(500).json({ error: error.message });
  }
};

export const getOrders = async (req, res) => {
  const userId = req.user._id;
  try {
    const offers = await Offer.find({ fromUserId: userId });
    res.status(200).json(offers);
  } catch (error) {
    console.error("Error in getOrders: ", error.message);
    res.status(500).json({ error: error.message });
  }
};

export const getOffer = async (req, res) => {
  const offerId = req.params.id;
  const userId = req.user._id;
  try {
    const offer = await Offer.findById(offerId);
    if (!offer) {
      return res.status(404).json({ message: "Offer not found" });
    }
    if (
      offer.fromUserId.toString() !== userId.toString() &&
      offer.toUserId.toString() !== userId.toString()
    ) {
      return res.status(403).json({ message: "Unauthorized" });
    }
    res.status(200).json(offer);
  } catch (error) {
    console.error("Error in getOffer: ", error.message);
    res.status(500).json({ error: error.message });
  }
};

export const replyToOffer = async (req, res) => {
  const offerId = req.params.id;
  const userId = req.user._id;
  const { status } = req.body;
  try {
    const offer = await Offer.findById(offerId);
    if (!offer) {
      return res.status(404).json({ message: "Offer not found" });
    }
    if (offer.toUserId.toString() !== userId.toString()) {
      return res.status(403).json({ message: "Unauthorized" });
    }
    if (offer.status !== "pending") {
      return res.status(400).json({ message: "Offer has already a reply" });
    }
    offer.status = status;
    await offer.save();

    // Create a notification for the fromUser
    await createNotification(
      offer.fromUserId,
      `Your offer has been ${status}`,
      "pending_offer",
      `/offers/${offer._id}`
    );

    res.status(200).json(offer);
  } catch (error) {
    console.error("Error in replyToOffer: ", error.message);
    res.status(500).json({ error: error.message });
  }
};
