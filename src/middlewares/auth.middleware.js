import jwt from "jsonwebtoken";
import { User } from "../models/user.schema.js";
import { ApiError } from "../utils/ApiError.js";

export const authMiddleware = async (req, res, next) => {
  try {
    const token =
      req.cookies.accessToken ||
      req.header("Authorization")?.replace("Bearer ", "");

    if (!token) {
      throw new ApiError(401, "Please login first");
    }

    const decoded = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);

    req.user = await User.findById(decoded.id).select("-password");

    if (!req.user) {
      throw new ApiError(401, "User not found");
    }

    next();
  } catch (error) {
    next(new ApiError(401, "Unauthorized"));
  }
};
