import Cart from "../models/cart.model.js";
import Product from "../models/product.model.js";

export const addItemsToCart = async (req, res) => {
  try {
    const { userId, productId, quantity } = req.body;
    if (!quantity)
      return res.status(400).json({ message: "quantity is required" });

    const product = await Product.findById(productId);

    // check product availability first
    if (!product.stock)
      return res.status(400).json({ message: "Product out of stock" });

    if (quantity > product.stock)
      return res.status(400).json({ message: "Not enough stock available" });

    // check if the user has a cart or not
    let cart = await Cart.findOne({ userId });

    // if no cart is present,create a cart for user
    if (!cart) {
      cart = await Cart.insertOne({
        userId,
        items: [{ productId, quantity }],
      });
    } else {
      // if cart is present and product already added,
      // check added quantity + current quantity
      let isFound = false;
      for (let item of cart.items) {
        if (item.productId === productId) {
          isFound = true;
          if (item.quantity + quantity > product.stock)
            return res
              .status(400)
              .json({ message: "Not enough stock available" });
          item.quantity += quantity;
          cart.save();
        }
      }
      // else add product into items array
      if (!isFound) {
        cart.items.push({ productId, quantity });
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

    const cart = await Cart.findOne({ userId });

    cart.items.forEach((item, index) => {
      if (item.productId === productId) {
        cart.items.splice(index, 1);
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
    const userId = "69ac044d953513b8a2afc923";

    const cart = await Cart.findOne({ userId });

    const cartItems = await Promise.all(
      cart.items.map(async (item) => {
        const productInfo = await Product.findById(item.productId).select(
          "title description price imageUrl",
        );

        return productInfo;
      }),
    );

    res.status(200).json(cartItems);
  } catch (error) {
    console.log("Error in getAllCartItems:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};
