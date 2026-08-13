import express from "express";
import { cartController } from "../controllers/cartController.js";
import { authMiddleware } from "../middleware/authMiddleware.js";

const router = express.Router();

router.use(authMiddleware);

router.get("/", cartController.getCart);
router.post("/items", cartController.addItem);
router.patch("/items/:id", cartController.updateItem);
router.delete("/items/:id", cartController.removeItem);
router.delete("/", cartController.clearCart);

export default router;
