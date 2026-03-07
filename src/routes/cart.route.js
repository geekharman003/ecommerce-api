import express from "express";
import { addItemsToCart, deleteItemsFromCart } from "../controllers/cart.controller.js";
const router = express.Router();

router.post("/", addItemsToCart);
router.delete("/", deleteItemsFromCart);

export default router;
