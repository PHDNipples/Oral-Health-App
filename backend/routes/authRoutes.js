// backend/routes/authRoutes.js
const express = require('express');
const router = express.Router();
const admin = require('../utils/firebase');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const crypto = require('crypto');
const rateLimit = require('express-rate-limit');
const User = require('../models/User');
const authMiddleware = require('../middleware/authMiddleware');
const {
  ALGORITHM,
  ISSUER,
  AUDIENCE,
  EXPIRES_IN,
} = require('../config/jwtConfig');

const JWT_SECRET = process.env.JWT_SECRET;
if (!JWT_SECRET) {
  throw new Error('JWT_SECRET environment variable is not set');
}

const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  limit: 10,
  standardHeaders: 'draft-8',
  legacyHeaders: false,
  message: { error: 'Too many authentication attempts. Please try again later.' },
});

const buildJwt = (uid, email, tokenVersion) =>
  jwt.sign({ uid, email, tokenVersion }, JWT_SECRET, {
    algorithm: ALGORITHM,
    issuer: ISSUER,
    audience: AUDIENCE,
    expiresIn: EXPIRES_IN,
  });

const syncFirebaseUser = async (decoded) => {
  const { uid, email, name } = decoded;
  let user = await User.findOne({ $or: [{ email }, { firebaseUid: uid }] });

  if (!user) {
    const randomPassword = crypto.randomBytes(32).toString('hex');
    const hashedPassword = await bcrypt.hash(randomPassword, 10);

    user = new User({
      name: name || 'New User',
      email,
      password: hashedPassword,
      firebaseUid: uid,
    });

    await user.save();
    return user;
  }

  if (!user.password) {
    const randomPassword = crypto.randomBytes(32).toString('hex');
    user.password = await bcrypt.hash(randomPassword, 10);
  }
  if (!user.firebaseUid) user.firebaseUid = uid;
  if (!user.name && name) user.name = name;
  if (user.email !== email) user.email = email;
  await user.save();

  return user;
};

router.post('/login', (_req, res) => {
  return res.status(410).json({
    error: 'Legacy login is no longer supported. Please use Firebase authentication.',
  });
});

router.post('/register', (_req, res) => {
  return res.status(410).json({
    error: 'Legacy registration is no longer supported. Please use Firebase authentication.',
  });
});

router.post('/createUser', (_req, res) => {
  return res.status(410).json({
    error: 'Legacy signup is no longer supported. Please use Firebase authentication.',
  });
});

router.post('/login-firebase', authLimiter, async (req, res) => {
  const { idToken } = req.body;

  if (!idToken) return res.status(400).json({ error: 'No Firebase ID token provided' });

  try {
    const decoded = await admin.auth().verifyIdToken(idToken);
    const user = await syncFirebaseUser(decoded);
    const token = buildJwt(decoded.uid, decoded.email, user.tokenVersion);

    res.json({
      token,
      user: { id: user._id, uid: decoded.uid, name: user.name, email: user.email },
    });
  } catch (err) {
    console.error('Firebase login failed:', err);
    res.status(401).json({ error: 'Invalid Firebase token' });
  }
});

router.post('/logout', authMiddleware, async (req, res) => {
  try {
    await User.findOneAndUpdate(
      { firebaseUid: req.user.uid },
      { $inc: { tokenVersion: 1 } }
    );
    res.json({ message: 'Logged out' });
  } catch (err) {
    console.error('Logout failed:', err);
    res.status(500).json({ error: 'Logout failed' });
  }
});

router.post('/signup', authLimiter, async (req, res) => {
  const { idToken } = req.body;

  if (!idToken) return res.status(400).json({ error: 'No Firebase ID token provided' });

  try {
    const decoded = await admin.auth().verifyIdToken(idToken);
    const user = await syncFirebaseUser(decoded);
    const token = buildJwt(decoded.uid, decoded.email, user.tokenVersion);

    res.status(201).json({
      message: 'User created',
      token,
      user: { id: user._id, uid: decoded.uid, name: user.name, email: user.email },
    });
  } catch (err) {
    console.error('Firebase signup failed:', err);
    res.status(401).json({ error: 'Invalid Firebase token' });
  }
});

module.exports = router;
