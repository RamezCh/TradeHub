import express from "express";
import {
  getService,
  getServicesByProvider,
  getServices,
} from "../controllers/service.controller.js";

const router = express.Router();

router.get("/", getServices);
router.get("/:id", getService);
router.get("/provider/:providerId", getServicesByProvider);

export default router;
