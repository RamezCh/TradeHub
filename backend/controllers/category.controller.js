import Category from "../models/Category.js";
import { createAudit } from "../lib/createAudit.js";

export const createCategory = async (req, res) => {
  try {
    const { name } = req.body;
    if (!name) {
      return res.status(400).json({ message: "Category name is required" });
    }
    const existingCategory = await Category.findOne({ name });
    if (existingCategory) {
      return res.status(400).json({ message: "Category already exists" });
    }

    const category = new Category({ name });
    await category.save();

    await createAudit(
      "Created",
      "category",
      category._id,
      req.user._id,
      `Category ${name} created`
    );
    res.status(201).json({ category });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const getCategories = async (req, res) => {
  try {
    const categories = await Category.find();
    res.status(200).json({ categories });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const renameCategory = async (req, res) => {
  try {
    const { id } = req.params;
    const { name } = req.body;
    if (!name) {
      return res.status(400).json({ message: "Category name is required" });
    }
    const category = await Category.findByIdAndUpdate(
      id,
      { name },
      { new: true }
    );
    if (!category) {
      return res.status(404).json({ message: "Category not found" });
    }
    await createAudit(
      "Edited",
      "category",
      id,
      req.user._id,
      `Category renamed to ${name}`
    );
    res.status(200).json({ category });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
