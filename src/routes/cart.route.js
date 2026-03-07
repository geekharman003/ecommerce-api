import express from "express";
import { addItemsToCart, deleteItemsFromCart, getAllCartItems } from "../controllers/cart.controller.js";
const router = express.Router();

router.post("/", addItemsToCart);
router.delete("/", deleteItemsFromCart);
router.get("/",getAllCartItems)

export default router;
