const express = require("express");
const router = express.Router();
const rateLimit = require("express-rate-limit");
const userController = require("../controllers/userController");
const authMiddleware = require("../middleware/authMiddleware");

// Same limiter shape as authRoutes.js — signup/login are the routes attackers
// brute-force, so both need rate limiting, not just the Firebase login path.
const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  limit: 10,
  standardHeaders: "draft-8",
  legacyHeaders: false,
  message: { error: "Too many attempts. Please try again later." },
});

// Legacy email/password routes intentionally disabled.
// Firebase auth flows through /api/auth/* and the app uses JWTs issued by that flow.
router.get("/me", authMiddleware, userController.getProfile);
router.put("/:id", authMiddleware, userController.updateUser);
router.delete("/:id", authMiddleware, userController.deleteUser);

module.exports = router;