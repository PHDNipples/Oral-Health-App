const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const User = require("../models/User");

// Legacy email/password auth is intentionally disabled. Firebase is the only
// supported authentication path for this app.
exports.createUser = async (_req, res) => {
  return res.status(410).json({
    error: "Legacy signup is no longer supported. Please use Firebase authentication.",
  });
};

exports.loginUser = async (_req, res) => {
  return res.status(410).json({
    error: "Legacy login is no longer supported. Please use Firebase authentication.",
  });
};

// Get current user profile
exports.getProfile = async (req, res) => {
  try {
    const user = await User.findOne({ email: req.user.email }).select("-password");
    if (!user) return res.status(404).json({ error: "User not found" });
    res.json(user);
  } catch (err) {
    console.error("Get profile error:", err);
    res.status(500).json({ error: "Server error" });
  }
};

// Update User
exports.updateUser = async (req, res) => {
  try {
    const targetUser = await User.findById(req.params.id);
    if (!targetUser) return res.status(404).json({ error: "User not found" });

    // req.user comes from the verified JWT (set by authMiddleware) — never trust
    // req.params.id alone. Both Firebase-issued and legacy JWT payloads include
    // email, so it's the one reliable field to compare across both token shapes.
    if (targetUser.email !== req.user.email) {
      return res.status(403).json({ error: "Not authorized to modify this user" });
    }

    const { name, email, password } = req.body;
    const update = { name, email };
    if (password) update.password = await bcrypt.hash(password, 10);

    const user = await User.findByIdAndUpdate(req.params.id, update, { new: true }).select("-password");
    res.json({ message: "User updated", user });
  } catch (err) {
    console.error("Update user error:", err);
    res.status(400).json({ error: "Update failed" });
  }
};

// Delete User
exports.deleteUser = async (req, res) => {
  try {
    const targetUser = await User.findById(req.params.id);
    if (!targetUser) return res.status(404).json({ error: "User not found" });

    if (targetUser.email !== req.user.email) {
      return res.status(403).json({ error: "Not authorized to delete this user" });
    }

    await User.findByIdAndDelete(req.params.id);
    res.json({ message: "User deleted" });
  } catch (err) {
    console.error("Delete user error:", err);
    res.status(400).json({ error: "Delete failed" });
  }
};