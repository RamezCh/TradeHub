import mongoose from "mongoose";

const categorySchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    unique: true, // Ensures no duplicate categories
    trim: true,
  },
});

const Category = mongoose.model("Category", categorySchema);

export default Category;
