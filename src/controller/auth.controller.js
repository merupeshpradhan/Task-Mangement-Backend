import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiResponse } from "../utils/ApiResponse.js";

export const checkRole = asyncHandler(async (req, res) => {
  // role comes from middleware
  const role = req.user.role;

  res.status(200).json(
    new ApiResponse(200, {
      role,
    }),
  );
});
