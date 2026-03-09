import mongoose, { Schema } from "mongoose";

const orderSchema = new Schema(
  {
    userId: {
      type: mongoose.Types.ObjectId,
      ref: "User",
      required: true,
    },
    orderItems: [
      {
        productId: String,
        quantity: Number,
      },
    ],
    totalAmount: {
      type: Number,
      required: true,
    },
    orderStatus: {
      type: String,
      default: "PLACED",
    },
    paymentStatus: {
      type: String,
      default: "PAID",
    },
  },
  { timestamps: true },
);

const Order = mongoose.model("Order", orderSchema);

export default Order;
