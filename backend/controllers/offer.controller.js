import Offer from "../models/Offer.js";
import Listing from "../models/Listing.js";
import User from "../models/User.js";
import Chat from "../models/Chat.js";
import { createNotification } from "../lib/utils/createNotification.js";

export const createOffer = async (req, res) => {
  const { listingId, toUserId, offerType, offerDetails } = req.body;
  const fromUserId = req.user._id;
  try {
    // Check if the listing exists
    const listing = await Listing.findById(listingId);
    if (!listing) {
      return res.status(404).json({ message: "Listing not found" });
    }
    // Check if the toUser exists
    const toUser = await User.findById(toUserId);
    if (!toUser) {
      return res.status(404).json({ message: "User not found" });
    }

    // Check if the fromUser is the owner of the listing
    if (listing.providerId.toString() === fromUserId.toString()) {
      return res.status(400).json({
        message: "You cannot make an offer on your own listing",
      });
    }

    // Check if the listing is active
    if (listing.status !== "available") {
      return res.status(400).json({
        message: "You cannot make an offer on an inactive listing",
      });
    }

    // Check if offer already exists
    const existingOffer = await Offer.findOne({
      listingId,
      fromUserId,
      toUserId,
    });

    if (existingOffer) {
      return res.status(400).json({
        message: "You have already made an offer on this listing",
      });
    }

    // Create a chat for the offer
    const chat = new Chat({
      participants: [fromUserId, toUserId],
    });
    await chat.save();

    // Add initial message
    chat.messages.push({
      senderId: fromUserId,
      content:
        "Hello there! I am interested in your listing with the title " +
        listing.title,
    });
    await chat.save();

    // Create the offer
    const offer = new Offer({
      listingId,
      fromUserId,
      toUserId,
      offerType,
      offerDetails,
      chatId: chat._id,
    });
    await offer.save();

    // Create a notification for the toUser
    await createNotification(
      toUserId,
      "You have received an offer",
      "pending_offer",
      `/offers/${offer._id}`
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
