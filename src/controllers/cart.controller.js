import Cart from "../models/cart.model.js";
import Product from "../models/product.model.js";

export const addItemsToCart = async (req, res) => {
  try {
    const { productId, userId } = req.body;
    const product = await Product.findById(productId);

    // check product availability first
    if (!product.stock) {
      return res.status(400).json({ message: "cannot add more items" });
    }

    // check if the user has a cart or not
    let cart = await Cart.findOne({ userId });

    // if no cart is present,creata a cart for user
    if (!cart) {
      cart = await Cart.insertOne({
        userId,
        items: [{ productId, quantity: 1 }],
      });
      product.stock--;
      product.save();
    } else {
        // if cart is present and product already added,
        // then update its quantity,
        // othwerwise add the product into cart
      let isFound = false;
      for (let item of cart.items) {
        if (item.productId === productId) {
          isFound = true;
          item.quantity += 1;
          product.stock--;
          product.save();
          cart.save();
        }
      }
      if (!isFound) {
        cart.items.push({ productId, quantity: 1 });
        product.stock--;
        product.save();
        cart.save();
      }
    }

    res.status(200).json({ message: "item added into the cart" });
  } catch (error) {
    console.log("Error in addItemsToCart:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

export const deleteItemsFromCart = async (req, res) => {
  try {
    const { productId, userId } = req.body;
    const product = await Product.findById(productId);

    const cart = await Cart.findOne({ userId });

    cart.items.forEach((item, index) => {
      if (item.productId === productId) {
        item.quantity -= 1;
        if (item.quantity === 0) {
          cart.items.splice(index, 1);
        }
        product.stock++;
        product.save();
        cart.save();
      }
    });

    res.status(200).json({ message: "item deleted from the cart" });
  } catch (error) {
    console.log("Error in deleteItemsFromCart:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

export const getAllCartItems = async (req, res) => {
  try {
    const cartItems = [];
    for (const key of cart.keys()) {
      const product = await Product.findById(key).select(
        "-createdAt -updatedAt",
      );
      cartItems.push(product);
    }

    res.status(200).json(cartItems);
  } catch (error) {
    console.log("Error in getAllCartItems:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};
