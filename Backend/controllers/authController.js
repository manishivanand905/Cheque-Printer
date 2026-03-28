const crypto = require("crypto");
const bcrypt = require("bcryptjs");
const User = require("../models/User");
const { generateToken } = require("../utils/token");
const { sendOtpEmail } = require("../utils/mailer");

function validateEmail(email) {
  return /^[a-zA-Z0-9._%+-]+@gmail\.com$/i.test(`${email || ""}`.trim());
}

function sanitizeUser(user) {
  return {
    id: user._id,
    name: user.name,
    email: user.email,
    phone: user.phone,
  };
}

function hashOtp(otp) {
  return crypto.createHash("sha256").update(otp).digest("hex");
}

async function register(req, res) {
  const name = `${req.body.name || ""}`.trim();
  const email = `${req.body.email || ""}`.trim().toLowerCase();
  const phone = `${req.body.phone || ""}`.trim();
  const password = `${req.body.password || ""}`;

  if (!name || !email || !phone || !password) {
    res.status(400);
    throw new Error("Name, Gmail, phone number, and password are required.");
  }

  if (!validateEmail(email)) {
    res.status(400);
    throw new Error("Please use a valid Gmail address.");
  }

  if (password.length < 6) {
    res.status(400);
    throw new Error("Password must be at least 6 characters.");
  }

  const existingUser = await User.findOne({ email });
  if (existingUser) {
    res.status(400);
    throw new Error("An account with this Gmail already exists.");
  }

  const passwordHash = await bcrypt.hash(password, 10);
  const user = await User.create({
    name,
    email,
    phone,
    password: passwordHash,
  });

  res.status(201).json({
    message: "Account created successfully.",
    token: generateToken(user._id),
    user: sanitizeUser(user),
  });
}

async function login(req, res) {
  const email = `${req.body.email || ""}`.trim().toLowerCase();
  const password = `${req.body.password || ""}`;

  if (!email || !password) {
    res.status(400);
    throw new Error("Gmail and password are required.");
  }

  const user = await User.findOne({ email });
  if (!user) {
    res.status(401);
    throw new Error("Invalid Gmail or password.");
  }

  const matches = await bcrypt.compare(password, user.password);
  if (!matches) {
    res.status(401);
    throw new Error("Invalid Gmail or password.");
  }

  res.json({
    message: "Login successful.",
    token: generateToken(user._id),
    user: sanitizeUser(user),
  });
}

async function getCurrentUser(req, res) {
  res.json({
    user: sanitizeUser(req.user),
  });
}

async function requestPasswordResetOtp(req, res) {
  const email = `${req.body.email || ""}`.trim().toLowerCase();

  if (!validateEmail(email)) {
    res.status(400);
    throw new Error("Please enter a valid Gmail address.");
  }

  const user = await User.findOne({ email });
  if (!user) {
    res.status(404);
    throw new Error("No user found with this Gmail address.");
  }

  const otp = `${Math.floor(100000 + Math.random() * 900000)}`;
  user.resetOtpHash = hashOtp(otp);
  user.resetOtpExpiresAt = new Date(Date.now() + 10 * 60 * 1000);
  await user.save();

  const mailStatus = await sendOtpEmail({
    to: user.email,
    otp,
    name: user.name,
  });

  res.json({
    message: mailStatus.delivered
      ? "OTP sent to your Gmail."
      : "OTP generated. SMTP is not configured, so check the backend server log.",
  });
}

async function resetPasswordWithOtp(req, res) {
  const email = `${req.body.email || ""}`.trim().toLowerCase();
  const otp = `${req.body.otp || ""}`.trim();
  const newPassword = `${req.body.newPassword || ""}`;

  if (!validateEmail(email) || !otp || !newPassword) {
    res.status(400);
    throw new Error("Gmail, OTP, and new password are required.");
  }

  if (newPassword.length < 6) {
    res.status(400);
    throw new Error("New password must be at least 6 characters.");
  }

  const user = await User.findOne({ email });
  if (!user || !user.resetOtpHash || !user.resetOtpExpiresAt) {
    res.status(400);
    throw new Error("OTP request not found for this Gmail.");
  }

  if (user.resetOtpExpiresAt.getTime() < Date.now()) {
    res.status(400);
    throw new Error("OTP has expired. Please request a new OTP.");
  }

  if (user.resetOtpHash !== hashOtp(otp)) {
    res.status(400);
    throw new Error("Invalid OTP.");
  }

  user.password = await bcrypt.hash(newPassword, 10);
  user.resetOtpHash = null;
  user.resetOtpExpiresAt = null;
  await user.save();

  res.json({
    message: "Password reset successful. Please log in with your new password.",
  });
}

module.exports = {
  register,
  login,
  getCurrentUser,
  requestPasswordResetOtp,
  resetPasswordWithOtp,
};
