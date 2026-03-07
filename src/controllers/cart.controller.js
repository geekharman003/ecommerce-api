const cart = new Map(); // {productId: quantity}

export const addItemsToCart = async (req, res) => {
  try {
    const { productId } = req.body;

    if (cart.has(productId)) {
      cart.set(productId, cart.get(productId) + 1);
    } else {
      cart.set(productId, 1);
    }

    console.log(cart);
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

    console.log(cart);

    res.status(200).json({ message: "item deleted from the cart" });
  } catch (error) {
    console.log("Error in deleteItemsFromCart:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};
