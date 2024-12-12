import Listing from "../models/Listing.js";

// Get a single Service
export const getService = async (req, res) => {
  try {
    const { id } = req.params;

    const service = await Listing.findById(id);

    if (service.type !== "service") {
      return res.status(404).json({ message: "service not found" });
    }

    if (!service) {
      return res.status(404).json({ message: "service not found" });
    }

    res.status(200).json({ service });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error fetching service", error: error.message });
  }
};

// Get Services by provider
export const getServicesByProvider = async (req, res) => {
  try {
    const { providerId } = req.params;

    const services = await Listing.find({ providerId, type: "service" }).sort({
      createdAt: -1,
    });

    if (services.length === 0) {
      return res.status(404).json({ message: "No services found" });
    }

    res.status(200).json({ services });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error fetching services", error: error.message });
  }
};

// Get Services
export const getServices = async (req, res) => {
  try {
    const services = await Listing.find({ type: "service" });

    if (services.length === 0) {
      return res.status(404).json({ message: "No services found" });
    }

    res.status(200).json({ services });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error fetching services", error: error.message });
  }
};
