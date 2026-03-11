import express from "express";
import {
  addItemsToCart,
  deleteItemsFromCart,
  getAllCartItems,
} from "../controllers/cart.controller.js";
import { authenticate } from "../middlewares/auth.middleware.js";
const router = express.Router();

router.use(authenticate);
router.post("/", addItemsToCart);
router.delete("/:productId", deleteItemsFromCart);
router.get("/", getAllCartItems);

export default router;
