import mongoose from "mongoose";

const locationSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    unique: true, // Ensures no duplicate locations
    trim: true,
  },
});

const Location = mongoose.model("Location", locationSchema);

export default Location;
