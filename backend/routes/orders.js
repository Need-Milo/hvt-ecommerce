import express from "express";
import { orderController } from "../controllers/orderController.js";
import { authMiddleware } from "../middleware/authMiddleware.js";

const router = express.Router();

router.use(authMiddleware);

router.get("/", orderController.list);
router.get("/:id", orderController.detail);
router.post("/", orderController.create);

export default router;
