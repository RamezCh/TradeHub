import express from "express";
import {
  createChat,
  getChats,
  getChat,
} from "../controllers/chat.controller.js";
import { protectRoute } from "../middleware/authMiddleware.js";

const router = express.Router();

router.post("/", protectRoute, createChat); // works
router.get("/", protectRoute, getChats); // works
router.get("/:chatId", protectRoute, getChat); // works

export default router;
