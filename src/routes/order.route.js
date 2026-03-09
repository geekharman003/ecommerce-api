import express from "express";
import { createOrder, viewOrder } from "../controllers/order.controller.js";
const router = express.Router();

router.post("/", createOrder);
router.get("/:orderId",viewOrder);

export default router;
