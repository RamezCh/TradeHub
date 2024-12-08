import Listing from "../models/Listing.js";
import { v2 as cloudinary } from "cloudinary";

// Create a new listing
export const createListing = async (req, res) => {
  try {
    const { type, title, description, conditions, location, category } =
      req.body;

    const userId = req.user._id;

    const ownerId = userId;

    // Upload images to Cloudinary
    const imageUrls = [];
    if (req.files && req.files.images) {
      for (const file of req.files.images) {
        const result = await cloudinary.uploader.upload(file.path, {
          folder: "tradehub/listings",
        });
        imageUrls.push(result.secure_url);
      }
    }

    // Create listing
    const listing = new Listing({
      ownerId,
      type,
      title,
      description,
      images: imageUrls,
      conditions,
      location,
      category,
    });

    await listing.save();
    res.status(201).json({ message: "Listing created successfully", listing });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error creating listing", error: error.message });
  }
};

// Edit an existing listing
export const editListing = async (req, res) => {
  try {
    const { id } = req.params;
    const updates = req.body;

    // Check if images are updated
    if (req.files && req.files.images) {
      const imageUrls = [];
      for (const file of req.files.images) {
        const result = await cloudinary.uploader.upload(file.path, {
          folder: "tradehub/listings",
        });
        imageUrls.push(result.secure_url);
      }
      updates.images = imageUrls;
    }

    const updatedListing = await Listing.findByIdAndUpdate(id, updates, {
      new: true,
      runValidators: true,
    });

    if (!updatedListing) {
      return res.status(404).json({ message: "Listing not found" });
    }

    res
      .status(200)
      .json({ message: "Listing updated successfully", updatedListing });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error updating listing", error: error.message });
  }
};

// Set listing as traded
export const setListingTraded = async (req, res) => {
  try {
    const { id } = req.params;

    const listing = await Listing.findByIdAndUpdate(
      id,
      { status: "traded" },
      { new: true }
    );

    if (!listing) {
      return res.status(404).json({ message: "Listing not found" });
    }

    res.status(200).json({ message: "Listing marked as traded", listing });
  } catch (error) {
    res.status(500).json({
      message: "Error marking listing as traded",
      error: error.message,
    });
  }
};

// Delete a listing
export const deleteListing = async (req, res) => {
  try {
    const { id } = req.params;

    const listing = await Listing.findByIdAndDelete(id);

    if (!listing) {
      return res.status(404).json({ message: "Listing not found" });
    }

    // Optionally, remove associated images from Cloudinary
    for (const imageUrl of listing.images) {
      const publicId = imageUrl.split("/").pop().split(".")[0];
      await cloudinary.uploader.destroy(`tradehub/listings/${publicId}`);
    }

    res.status(200).json({ message: "Listing deleted successfully" });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error deleting listing", error: error.message });
  }
};

// Get all listings (optional feature)
export const getAllListings = async (req, res) => {
  try {
    const { type, category, location, status } = req.query;

    const filters = {};
    if (type) filters.type = type;
    if (category) filters.category = category;
    if (location) filters.location = location;
    if (status) filters.status = status;

    const listings = await Listing.find(filters);

    res.status(200).json({ listings });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error fetching listings", error: error.message });
  }
};
