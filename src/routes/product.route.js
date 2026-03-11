import express from "express";
const router = express.Router();

import {
  addProduct,
  getProducts,
  getProduct,
  updateProduct,
  deleteProduct,
  getAllProducts,
} from "../controllers/product.controller.js";
import { authenticate } from "../middlewares/auth.middleware.js";

router.use(authenticate);
router.post("/", addProduct);
router.get("/", getProducts);
router.get("/all", getAllProducts);
router.get("/:productId", getProduct);
router.put("/:productId", updateProduct);
router.delete("/:productId", deleteProduct);

export default router;
