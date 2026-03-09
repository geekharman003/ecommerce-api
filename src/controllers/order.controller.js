import Cart from "../models/cart.model.js";
import Order from "../models/order.model.js";
import Product from "../models/product.model.js";

export const createOrder = async (req, res) => {
  try {
    const { userId } = req.body;

    // find cart with userId
    const cart = await Cart.findOne({ userId });
    console.log(cart);

    let totalAmount = 0; //stores the order total

    // for each cart item,fetch item price and add them into orderItems
    const orderItems = await Promise.all(
      cart.items.map(async (item) => {
        const product = await Product.findById(item.productId).select("price");
        totalAmount += product.price * item.quantity;

        return item;
      }),
    );

    const order = await Order.insertOne({
      userId,
      orderItems,
      totalAmount,
    });

    // empty the user cart
    cart.items = [];
    cart.save();

    res.status(201).json(order);
  } catch (error) {
    console.log("Error in createOrder:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};
