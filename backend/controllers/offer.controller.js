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

export const getOffers = async (req, res) => {
  try {
    const { status, page = 1, limit = 10 } = req.query;
    const userId = req.user._id;

    const filter = {
      $or: [{ sender: userId }, { receiver: userId }],
    };
    if (status) {
      filter.status = status;
    }
    const pageNumber = parseInt(page, 10);
    const limitNumber = parseInt(limit, 10);

    const skip = (pageNumber - 1) * limitNumber;

    const totalOffers = await Offer.countDocuments(filter);

    const totalPages = Math.ceil(totalOffers / limitNumber);

    const offers = await Offer.find(filter)
      .skip(skip)
      .limit(limitNumber)
      .populate("listingId", "title images")
      .populate("sender", "firstName lastName username email")
      .populate("receiver", "firstName lastName username email");

    res.status(200).json({
      success: true,
      data: offers,
      totalPages,
      currentPage: pageNumber,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to fetch offers",
      error: error.message,
    });
  }
};

export const getOffer = async (req, res) => {
  const { offerId } = req.params;
  const userId = req.user._id;

  try {
    const offer = await Offer.findById(offerId);
    if (!offer) {
      return res.status(404).json({ message: "Offer not found" });
    }
    if (
      offer.sender.toString() !== userId.toString() &&
      offer.receiver.toString() !== userId.toString()
    ) {
      return res.status(403).json({ message: "Unauthorized" });
    }
    const codeToScan =
      userId.toString() === offer.sender.toString()
        ? offer.senderConfirmation.code
        : offer.receiverConfirmation.code;
    res.json({ offer, codeToScan });
  } catch (error) {
    console.error("Error fetching offer:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

export const confirmOffer = async (req, res) => {
  const { offerId } = req.params;
  const { code } = req.body;
  const userId = req.user._id;

  const normalizedCode = code.trim();

  try {
    const offer = await Offer.findById(offerId);
    if (!offer) {
      return res.status(404).json({ message: "Offer not found" });
    }

    if (userId.toString() === offer.sender.toString()) {
      if (normalizedCode === offer.receiverConfirmation.code) {
        offer.senderConfirmation.confirmed = true;
      } else {
        return res.status(400).json({ message: "Invalid code" });
      }
    } else if (userId.toString() === offer.receiver.toString()) {
      if (normalizedCode === offer.senderConfirmation.code) {
        offer.receiverConfirmation.confirmed = true;
      } else {
        return res.status(400).json({ message: "Invalid code" });
      }
    } else {
      return res.status(403).json({ message: "Unauthorized" });
    }

    await offer.save();
    res.json({ message: "Confirmation successful", offer });
  } catch (error) {
    console.error("Error confirming offer:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};
