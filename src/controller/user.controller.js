import { User } from "../models/user.schema.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";

// =========================
//         SIGNUP
// =========================
const userSignup = asyncHandler(async (req, res) => {
  const { fullName, email, password } = req.body;

  if (!fullName || !email || !password) {
    throw new ApiError(400, "Please provide all required details.");
  }

  const otherEmail = await User.findOne({ email });
  if (otherEmail) {
    throw new ApiError(400, "This email is already registered.");
  }

  // create user first without avatar
  let user = new User({ fullName, email, password });

  // save the user to DB
  try {
    console.log("Before save");

    await user.save();

    const userData = {
      id: user._id,
      fullName: user.fullName,
      email: user.email,
    };
    return res
      .status(201)
      .json(new ApiResponse(201, userData, "User registered successfully."));
  } catch (error) {
    console.log("After save");
    console.log(error);
  }
});

// =========================
//          SIGNIN
// =========================
const userSignin = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    throw new ApiError(400, "Please provide email and password.");
  }

  const user = await User.findOne({ email });
  if (!user) {
    throw new ApiError(400, "Please provide correct email.");
  }

  const isPasswordCorrect = await user.comparePassword(password);
  if (!isPasswordCorrect) {
    throw new ApiError(400, "Incorrect password.");
  }

  const accessToken = user.generateAccessToken();
  const refreshToken = await user.generateRefreshToken();

  // Save refreshToken in DB
  user.refreshToken = refreshToken;
  await user.save({ validateBeforeSave: false });

  // now add
  const cookieOptions = {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict",
  };

  res.cookie("accessToken", accessToken, cookieOptions);
  res.cookie("refreshToken", refreshToken, cookieOptions);

  const userData = {
    id: user._id,
    fullName: user.fullName,
    email: user.email,
    role: user.role,
    accessToken: accessToken,
    refreshToken: refreshToken,
  };

  return res
    .status(200)
    .json(
      new ApiResponse(
        200,
        userData,
        `Welcome to Task Management, ${userData.fullName}!`,
      ),
    );
});

// =========================
//     GET ALL USERS (ADMIN)
// =========================
const getAllUsers = asyncHandler(async (req, res) => {
  const users = await User.find({ role: "user" }).select("_id fullName email");

  return res
    .status(200)
    .json(new ApiResponse(200, users, "Users fetched successfully"));
});

// =========================
//          LOGOUT
// =========================
const userLogout = asyncHandler(async (req, res) => {
  const user = req.user;
  if (user) {
    user.refreshToken = null;
    await user.save({ validateBeforeSave: false });
  }

  const option = {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict",
  };

  res.clearCookie("accessToken", option);
  res.clearCookie("refreshToken", option);

  return res
    .status(200)
    .json(new ApiResponse(200, {}, "User logout successfully."));
});

export { userSignup, userSignin, getAllUsers, userLogout };
