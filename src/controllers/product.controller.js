import Product from "../models/product.model.js";

export const addProduct = async (req, res) => {
  try {
    const { userId,title, description, price, imageUrl } = req.body;
    const product = await Product.insertOne({
      userId,
      title,
      description,
      price,
      imageUrl,
    });

    res.status(201).json(product);
  } catch (error) {
    console.log("Error in addProduct:", error);
    res.status(500).json({ message: error.messge });
  }
};

export const getProducts = async (req, res) => {
  try {
    const products = await Product.find();
    res.status(200).json(products);
  } catch (error) {
    console.log("Error in getProducts:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

export const getProduct = async (req, res) => {
  try {
    const { productId } = req.params;

    const product = await Product.findById(productId).select(
      "-createdAt -updatedAt",
    );
    res.status(200).json(product);
  } catch (error) {
    console.log("Error in getProduct:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

export const updateProduct = async (req, res) => {
  try {
    const { productId } = req.params;
    const { title, description, price, imageUrl } = req.body;

    const filter = { _id: productId };
    const update = { $set: { title, description, price, imageUrl } };

    const updatedProductInfo = await Product.updateOne(filter, update);
    console.log(updatedProductInfo);

    res.status(200).json({ message: "Product details updated successfully" });
  } catch (error) {
    console.log("Error in updateProduct:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

export const deleteProduct = async (req, res) => {
  try {
    const { productId } = req.params;
    const deletedProductInfo = await Product.deleteOne({ _id: productId });
    console.log(deletedProductInfo);

    res.status(200).json({ message: "product deleted successfully" });
  } catch (error) {
    console.log("Error in deleteProduct:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};


