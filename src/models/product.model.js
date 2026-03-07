import mongoose, { Schema } from "mongoose";

const productSchema = new Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    title: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
    price: {
      type: Number,
      required: true,
    },
    imageUrl: {
      type: String,
    },
    stock: {
      type: Number,
      required: true,
    },
  },
  { timestamps: true },
);

const Product = mongoose.model("Product", productSchema);

export default Product;
