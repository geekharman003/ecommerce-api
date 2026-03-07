import Product from "../models/product.model.js";

const cart = new Map(); // {productId: quantity}

export const addItemsToCart = async (req, res) => {
  try {
    const { productId } = req.body;
    const product = await Product.findById(productId);

    if (!product.stock) {
      return res.status(400).json({ message: "cannot add more items" });
    }

    if (cart.has(productId)) {
      cart.set(productId, cart.get(productId) + 1);
      product.stock--;
      product.save();
    } else {
      cart.set(productId, 1);
      product.stock--;
      product.save();
    }

    res.status(200).json({ message: "item added into the cart" });
  } catch (error) {
    console.log("Error in addItemsToCart:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

export const deleteItemsFromCart = async (req, res) => {
  try {
    const { productId } = req.body;

    if (cart.has(productId)) {
      cart.set(productId, cart.get(productId) - 1);
      if (cart.get(productId) === 0) cart.delete(productId);
    } else {
      return res.status(404).json({ message: "productId didn't exist" });
    }

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
      const product = await Product.findById(key).select("-createdAt -updatedAt");
      cartItems.push(product);
    }

    res.status(200).json(cartItems);
  } catch (error) {
    console.log("Error in getAllCartItems:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};
