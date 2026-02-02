import { Router } from "express";
import {
  userSignin,
  userLogout,
  getAllUsers,
  userSignup,
} from "../controller/user.controller.js";
import { authMiddleware } from "../middlewares/auth.middleware.js";
import { refreshAccessToken } from "../controller/refreshToken.controller.js";
import { adminOnly } from "../middlewares/admin.middleware.js";

const router = Router();

router.route("/signup").post(userSignup);
router.route("/signin").post(userSignin);
router.get("/", authMiddleware, adminOnly, getAllUsers);
router.route("/logout").post(authMiddleware, userLogout);
router.route("/refresh-token").post(refreshAccessToken);

export default router;
