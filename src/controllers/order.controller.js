import Cart from "../models/cart.model.js";
import Order from "../models/order.model.js";
import Product from "../models/product.model.js";

export const createOrder = async (req, res) => {
  try {
    const { userId } = req.body;

    // find cart with userId
    const cart = await Cart.findOne({ userId });

    let totalAmount = 0; //stores the order total

    // for each cart item,fetch item price and add them into orderItems
    const orderItems = await Promise.all(
      cart.items.map(async (item) => {
        const product = await Product.findById(item.productId).select(
          "stock price",
        );

        if (item.quantity > product.stock)
          return res
            .status(400)
            .json({ message: "Not enough stock available" });

        totalAmount += product.price * item.quantity;

        return item;
      }),
    );

    if (!orderItems.length)
      return res.status(404).json({ message: "No items added in the cart" });

    const order = await Order.insertOne({
      userId,
      orderItems,
      totalAmount,
    });

    // finally decrease the stock value of each product
    cart.items.forEach(async (item) => {
      const product = await Product.findById(item.productId).select("stock");
      product.stock -= item.quantity;
      product.save();
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
    const order = await Order.findById(orderId);

    const orderedProducts = await Promise.all(
      order.orderItems.map(async (item) => {
        const product = await Product.findById(item.productId).select(
          "title description price imageUrl",
        );

        return product;
      }),
    );

    const orderDetails = {
      orderedProducts,
      totalAmount: order.totalAmount,
      orderStatus: order.orderStatus,
      paymentStatus: order.paymentStatus,
    };

    res.status(200).json(orderDetails);
  } catch (error) {
    console.log("Error in viewOrdere:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};
