import express from "express";
const router = express.Router();

import {
  addProduct,
  getProducts,
  updateProduct,
  deleteProduct
} from "../controllers/product.controller.js";
import { authenticate, verifyAdmin } from "../middlewares/auth.middleware.js";

router.use(authenticate)
router.use(verifyAdmin);
router.post("/", addProduct);
router.get("/", getProducts);
router.put("/:productId", updateProduct);
router.delete("/:productId",deleteProduct)

export default router;
