import Listing from "../models/Listing.js";
import { v2 as cloudinary } from "cloudinary";

// Create a new listing
export const createListing = async (req, res) => {
  try {
    const { type, title, description, condition, location, category } =
      req.body;
    const providerId = req.user._id;
    let { images } = req.body; // Expecting an array of Base64 strings

    if (!Array.isArray(images)) {
      return res.status(400).json({ message: "Images should be an array" });
    }

    // Upload each image to Cloudinary
    const uploadedImages = await Promise.all(
      images.map(async (image) => {
        const result = await cloudinary.uploader.upload(image);
        return result.secure_url; // Return the Cloudinary URL
      })
    );

    // Create listing
    const listing = new Listing({
      providerId,
      type,
      title,
      description,
      images: uploadedImages, // Store all uploaded image URLs
      condition,
      location,
      category,
    });

    await listing.save();

    res.status(201).json({ message: "Listing created successfully", listing });
  } catch (error) {
    res.status(500).json({
      message: "Error creating listing",
      error: error.message,
    });
  }
};

// Edit an existing listing
export const editListing = async (req, res) => {
  try {
    const { id } = req.params;
    let { images } = req.body; // Images array in req.body
    const updates = req.body;

    // Check if images are updated
    if (images && Array.isArray(images)) {
      // Upload each image to Cloudinary
      const uploadedImages = await Promise.all(
        images.map(async (image) => {
          const result = await cloudinary.uploader.upload(image);
          return result.secure_url; // Return the secure URL
        })
      );
      updates.images = uploadedImages; // Update the images field
    }

    // Update the listing with new data
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

// Toggle Listing Status
export const toggleListingStatus = async (req, res) => {
  try {
    const { id } = req.params;

    const listing = await Listing.findById(id);

    if (!listing) {
      return res.status(404).json({ message: "Listing not found" });
    }

    listing.status = listing.status === "available" ? "traded" : "available";
    await listing.save();

    res
      .status(200)
      .json({ message: `Listing marked as ${listing.status}`, listing });
  } catch (error) {
    res.status(500).json({
      message: `Error marking listing as ${listing.status}`,
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

// Get all listings
export const getAllListings = async (req, res) => {
  try {
    const listings = await Listing.find({ status: "available" }).sort({
      createdAt: -1,
    });

    if (listings.length === 0) {
      return res.status(404).json({ message: "No listings found" });
    }

    res.status(200).json({ listings });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error fetching listings", error: error.message });
  }
};
