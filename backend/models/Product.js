import mongoose from "mongoose";

const productSchema = new mongoose.Schema(
  {
    type: {
      type: String,
      enum: ["item", "service"],
      required: true,
    },
    name: {
      type: String,
      required: true,
    },
    description: {
      type: String,
    },
    seller: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    price: {
      type: Number,
      required: function () {
        return !this.tradeOptions;
      },
    },
    tradeOptions: {
      type: [
        {
          type: {
            type: String,
            enum: ["item", "service", "price+item", "service+price"],
            required: true,
          },
          details: {
            type: mongoose.Schema.Types.ObjectId,
            refPath: "tradeOptions.type",
          },
          discount: {
            type: Number,
            min: 0,
            max: 100,
          },
        },
      ],
      validate: {
        validator: function (v) {
          return this.price || (v && v.length > 0); // Ensure at least one of price or tradeOptions is provided
        },
        message: "Either price or tradeOptions must be provided.",
      },
    },
  },
  { timestamps: true }
);

const Product = mongoose.model("Product", productSchema);

export default Service;
