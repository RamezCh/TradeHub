import express from "express";
import {
  createCategory,
  getCategories,
  renameCategory,
} from "../controllers/category.controller.js";
import { protectAdminRoute } from "../middleware/authMiddleware.js";

const router = express.Router();

router.post("/", protectAdminRoute, createCategory);
router.get("/", getCategories);
router.put("/:id", protectAdminRoute, renameCategory);

export default router;
