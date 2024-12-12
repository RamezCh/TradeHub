import Listing from "../models/Listing.js";

// Get a single item
export const getItem = async (req, res) => {
  try {
    const { id } = req.params;

    const item = await Listing.findById(id);

    if (!item) {
      return res.status(404).json({ message: "item not found" });
    }

    res.status(200).json({ item });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error fetching item", error: error.message });
  }
};

// Get Items by provider
export const getItemsByProvider = async (req, res) => {
  try {
    const { providerId } = req.params;

    const items = await Listing.find({ providerId, type: "item" }).sort({
      createdAt: -1,
    });

    if (items.length === 0) {
      return res.status(404).json({ message: "No items found" });
    }

    res.status(200).json({ items });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error fetching items", error: error.message });
  }
};

// Get Items
export const getItems = async (req, res) => {
  try {
    const items = await Listing.find({ type: "item" });

    if (items.length === 0) {
      return res.status(404).json({ message: "No items found" });
    }

    res.status(200).json({ items });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error fetching items", error: error.message });
  }
};
