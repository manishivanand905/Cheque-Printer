const express = require("express");
const asyncHandler = require("../middlewares/asyncHandler");
const { protect } = require("../middlewares/authMiddleware");
const {
  register,
  login,
  getCurrentUser,
  requestPasswordResetOtp,
  resetPasswordWithOtp,
} = require("../controllers/authController");

const router = express.Router();

router.post("/register", asyncHandler(register));
router.post("/login", asyncHandler(login));
router.get("/me", protect, asyncHandler(getCurrentUser));
router.post("/forgot-password/request-otp", asyncHandler(requestPasswordResetOtp));
router.post("/forgot-password/reset", asyncHandler(resetPasswordWithOtp));

module.exports = router;
