// backend/middleware/authMiddleware.js
const jwt = require('jsonwebtoken');
const User = require('../models/User');
if (!process.env.JWT_SECRET) {
  throw new Error('JWT_SECRET environment variable is not set');
}
const JWT_SECRET = process.env.JWT_SECRET;

module.exports = async (req, res, next) => {
  const authHeader = req.header('Authorization');
  const token = authHeader && authHeader.startsWith('Bearer ')
    ? authHeader.split(' ')[1]
    : null;

  if (!token) return res.status(401).json({ error: 'No token, authorization denied' });

  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    const user = await User.findOne({ firebaseUid: decoded.uid });
    if (!user || decoded.tokenVersion !== user.tokenVersion) {
      return res.status(401).json({ error: 'Token has been revoked' });
    }

    req.user = {
      uid: decoded.uid ?? decoded.id ?? decoded._id,
      email: decoded.email,
    };
    next();
  } catch (err) {
    console.error('Backend JWT verification failed:', err);
    res.status(401).json({ error: 'Token is not valid' });
  }
};
