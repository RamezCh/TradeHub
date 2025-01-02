import Listing from "../models/Listing.js";
import { v2 as cloudinary } from "cloudinary";

// Create a new listing
export const createListing = async (req, res) => {
  try {
    const { title, description, location, category, price, images } = req.body;
    let { type, condition, acceptsOtherPaymentForm } = req.body;
    const seller = req.user._id;

    type = type.toLowerCase();
    condition = condition.toLowerCase();
    acceptsOtherPaymentForm = acceptsOtherPaymentForm.toLowerCase();

    // Validate fields
    if (!title || !description || !location || !category || !price) {
      return res.status(400).json({
        message:
          "Missing required fields: title, description, location, category, and price",
        data: req.body,
      });
    }

    if (typeof price !== "number") {
      return res.status(400).json({ message: "Price should be a number" });
    }

    let validatedImages = [];
    if (images) {
      if (!Array.isArray(images)) {
        return res.status(400).json({ message: "Images should be an array" });
      }

      // Validate each image format (assuming they're base64 strings)
      const isValidImageFormat = images.every(
        (image) => typeof image === "string" && image.startsWith("data:image")
      );
      if (!isValidImageFormat) {
        return res
          .status(400)
          .json({ message: "Images should be valid base64 strings" });
      }

      // Upload each image to Cloudinary
      validatedImages = await Promise.all(
        images.map(async (image) => {
          const result = await cloudinary.uploader.upload(image);
          return result.secure_url;
        })
      );
    }

    // Create listing
    const listing = new Listing({
      seller,
      type,
      title,
      description,
      images: validatedImages,
      condition,
      location,
      category,
      price,
      acceptsOtherPaymentForm: acceptsOtherPaymentForm || "none",
    });

    await listing.save();

    res.status(201).json({ message: "Listing created successfully", listing });
  } catch (error) {
    console.error(error);
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
    if (updates?.type) {
      updates.type = updates.type.toLowerCase();
    }

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
    const { page = 1, limit = 5, type = "all" } = req.query;
    const skip = (page - 1) * limit;

    let correctedType = type.toLowerCase();
    correctedType = correctedType !== "all" ? correctedType : "all";
    correctedType = correctedType.startsWith("ite") ? "item" : correctedType;
    correctedType = correctedType.startsWith("serv")
      ? "service"
      : correctedType;

    // Filter by type if specified, else fetch all types
    const filter =
      type !== "all"
        ? { type: correctedType, status: "available" }
        : { status: "available" };

    // Fetch listings with pagination, type filtering, and population of fields
    const listings = await Listing.find(filter)
      .populate("seller", "firstName lastName username profileImg createdAt")
      .populate("location", "name")
      .populate("category", "name")
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(parseInt(limit))
      .lean();

    const totalListings = await Listing.countDocuments(filter);

    if (listings.length === 0) {
      return res.status(200).json({ message: "No listings found" });
    }

    // Flatten the populated fields for each listing
    const flatListings = listings.map(
      ({ seller, location, category, ...rest }) => ({
        ...rest,
        providerFirstName: seller?.firstName || null,
        providerLastName: seller?.lastName || null,
        providerUsername: seller?.username || null,
        providerProfileImg: seller?.profileImg || null,
        providerCreatedAt: seller?.createdAt || null,
        location: location?.name || null,
        category: category?.name || null,
      })
    );

    const totalPages = Math.ceil(totalListings / limit);

    res.status(200).json({
      listings: flatListings,
      totalListings,
      totalPages,
    });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error fetching listings", error: error.message });
  }
};

// Get a single listing
export const getListing = async (req, res) => {
  try {
    const { id } = req.params;

    // Fetch the listing, populate seller, location, and category fields
    const listing = await Listing.findById(id)
      .populate("seller", "firstName lastName username profileImg createdAt")
      .populate("location", "name") // Populate location to get name
      .populate("category", "name") // Populate category to get name
      .lean();

    if (!listing) {
      return res.status(404).json({ message: "Listing not found" });
    }

    // Extract seller, location, and category details, and flatten the listing object
    const { seller, location, category, ...restListing } = listing;
    const flatListing = {
      ...restListing,
      providerFirstName: seller.firstName,
      providerLastName: seller.lastName,
      providerUsername: seller.username,
      providerProfileImg: seller.profileImg,
      providerCreatedAt: seller.createdAt,
      location: location.name, // Replace location object with name
      category: category.name, // Replace category object with name
    };

    res.status(200).json({ listing: flatListing });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error fetching listing", error: error.message });
  }
};

// Get listings by provider
export const getListingsByProvider = async (req, res) => {
  try {
    const { providerId } = req.params;

    const listings = await Listing.find({ providerId }).sort({ createdAt: -1 });

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

// Get My Listings
export const getMyListings = async (req, res) => {
  try {
    const listings = await Listing.find({ seller: req.user._id })
      .populate("location", "name")
      .populate("category", "name")
      .sort({ createdAt: -1 })
      .lean();

    if (listings.length === 0) {
      return res.status(404).json({ message: "No listings found" });
    }

    const formattedListings = listings.map((listing) => {
      const { location, category, ...restListing } = listing;
      return {
        ...restListing,
        location: location?.name || null,
        category: category?.name || null,
      };
    });

    res.status(200).json({ listings: formattedListings });
  } catch (error) {
    res.status(500).json({
      message: "Error fetching listings",
      error: error.message,
    });
  }
};

// Search for listings
export const searchListings = async (req, res) => {
  try {
    const {
      query,
      page = 1,
      limit = 5,
      type,
      priceMin,
      priceMax,
      category,
    } = req.query;
    const skip = (page - 1) * limit;

    // Handle and sanitize `type`
    let correctedType = type?.toLowerCase() || null;
    if (correctedType) {
      correctedType = correctedType.startsWith("ite") ? "item" : correctedType;
      correctedType = correctedType.startsWith("serv")
        ? "service"
        : correctedType;
    }

    // Build the dynamic query object
    const searchQuery = {
      status: "available",
      ...(correctedType !== "all" && correctedType && { type: correctedType }),
      ...(category && { category: { $regex: category, $options: "i" } }),
      ...(priceMin &&
        !isNaN(priceMin) && { price: { $gte: Number(priceMin) } }),
      ...(priceMax &&
        !isNaN(priceMax) && {
          price: { ...searchQuery?.price, $lte: Number(priceMax) },
        }),
      $or: [
        { title: { $regex: query || "", $options: "i" } },
        { description: { $regex: query || "", $options: "i" } },
      ],
    };

    // Search for listings
    const listings = await Listing.find(searchQuery)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(parseInt(limit));

    // Handle empty results
    if (listings.length === 0) {
      return res.status(200).json({ message: "No listings found" });
    }

    res.status(200).json({ listings });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error searching listings", error: error.message });
  }
};
