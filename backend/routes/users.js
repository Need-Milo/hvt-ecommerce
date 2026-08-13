import express from "express";
import { userController } from "../controllers/userController.js";
import { authMiddleware } from "../middleware/authMiddleware.js";

const router = express.Router();

router.get("/me", authMiddleware, userController.getMe);
router.patch("/me", authMiddleware, userController.updateMe);

export default router;
