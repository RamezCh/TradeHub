import Location from "../models/Location.js";
import { createAudit } from "../lib/createAudit.js";

export const createLocation = async (req, res) => {
  try {
    const { name } = req.body;
    if (!name) {
      return res.status(400).json({ message: "Location name is required" });
    }
    const existingLocation = await Location.findOne({ name });
    if (existingLocation) {
      return res.status(400).json({ message: "Location already exists" });
    }

    const location = new Location({ name });
    await location.save();

    await createAudit(
      "Created",
      "location",
      location._id,
      req.user._id,
      `Location ${location.name} created`
    );
    res.status(201).json({ location });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const getLocations = async (req, res) => {
  try {
    const locations = await Location.find();
    res.status(200).json({ locations });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const renameLocation = async (req, res) => {
  try {
    const { id } = req.params;
    const { name } = req.body;
    if (!name) {
      return res.status(400).json({ message: "Location name is required" });
    }
    const location = await Location.findByIdAndUpdate(
      id,
      { name },
      { new: true }
    );
    if (!location) {
      return res.status(404).json({ message: "Location not found" });
    }

    await createAudit(
      "Edited",
      "location",
      location._id,
      req.user._id,
      `Location ${location.name} renamed to ${name}`
    );
    res.status(200).json({ location });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
