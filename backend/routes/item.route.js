import express from "express";
import {
  getItem,
  getItemsByProvider,
  getItems,
} from "../controllers/item.controller.js";

const router = express.Router();

router.get("/", getItems); // works
router.get("/:id", getItem); // works
router.get("/provider/:providerId", getItemsByProvider); // works

export default router;
