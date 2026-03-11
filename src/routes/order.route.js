import express from "express";
import {
  createOrder,
  getOrders,
  getOrder,
} from "../controllers/order.controller.js";
import { authenticate } from "../middlewares/auth.middleware.js";
const router = express.Router();

router.use(authenticate);
router.post("/", createOrder);
router.get("/", getOrders);
router.get("/:orderId", getOrder);

export default router;
