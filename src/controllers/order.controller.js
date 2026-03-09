import Cart from "../models/cart.model.js";
import Order from "../models/order.model.js";

export const createOrder = async (req, res) => {
  try {
    const { userId } = req.body;

    // find cart with userId
    const cart = await Cart.findOne({ userId }).populate(
      "items.productId",
      "stock price",
    );

    if (!cart.items.length)
      return res.status(404).json({ message: "No products added in the cart" });

    let totalAmount = 0; //stores the order total

    // for each cart item,fetch item price and add them into orderItems
    const orderItems = cart.items.map((item) => {
      if (item.quantity > item.productId.stock)
        return res.status(400).json({ message: "Not enough stock available" });

      totalAmount += item.productId.price * item.quantity;

      return item;
    });

    if (!orderItems.length)
      return res.status(404).json({ message: "No items added in the cart" });

    const order = await Order.insertOne({
      userId,
      orderItems,
      totalAmount,
    });

    // // finally decrease the stock value of each product
    cart.items.forEach((item) => {
      item.productId.stock -= item.quantity;
      item.productId.save();
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

export const viewOrder = async (req, res) => {
  try {
    const { orderId } = req.params;
    const order = await Order.findById(orderId).populate(
      "orderItems.productId",
      "title description price imageUrl",
    );

    res.status(200).json(order.orderItems);
  } catch (error) {
    console.log("Error in viewOrdere:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};
