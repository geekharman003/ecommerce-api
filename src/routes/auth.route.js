import express from "express";
const router = express.Router();

import { signup, login, logout } from "../controllers/auth.controller.js";
import { authenticate } from "../middlewares/auth.middleware.js";

router.post("/signup", signup);
router.post("/login", login);
router.post("/logout", logout);
router.get("/check", authenticate, (req, res) => {
  res.status(200).json(req.user);
});

export default router;
