import { Router } from "express";
import { authMiddleware } from "../middlewares/auth.middleware.js";
import { checkRole } from "../controller/auth.controller.js";

const router = Router();

router.get("/check-role", authMiddleware, checkRole);

export default router;
