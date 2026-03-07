import express from "express";
const router = express.Router();

import {
  addProduct,
  getProducts,
  updateProduct,
  deleteProduct
} from "../controllers/product.controller.js";

router.post("/", addProduct);
router.get("/", getProducts);
router.put("/:productId", updateProduct);
router.delete("/:productId",deleteProduct)

export default router;
