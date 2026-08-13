import express from "express";
import { productController } from "../controllers/productController.js";

const router = express.Router();

router.get("/", productController.list);
router.get("/featured", productController.featured);
router.get("/:id/related", productController.related);
router.get("/:id", productController.detail);

export default router;
