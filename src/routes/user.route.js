import express from "express";
const router = express.Router();

import {createUser, findUserById} from "../controllers/user.controller.js"

router.post("/",createUser)
router.get("/:userId",findUserById)



export default router;