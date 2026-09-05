// backend/middleware/authMiddleware.js
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const {
  ALGORITHM,
  ISSUER,
  AUDIENCE,
  REQUIRED_CLAIMS,
} = require('../config/jwtConfig');
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

  let decoded;
  try {
    decoded = jwt.verify(token, JWT_SECRET, {
      algorithms: [ALGORITHM],
      issuer: ISSUER,
      audience: AUDIENCE,
    });
  } catch {
    return res.status(401).json({ error: 'Token is not valid' });
  }

  const hasRequiredClaims = REQUIRED_CLAIMS.every((claim) => decoded[claim] !== undefined);
  if (
    !hasRequiredClaims ||
    typeof decoded.uid !== 'string' ||
    typeof decoded.email !== 'string' ||
    typeof decoded.tokenVersion !== 'number'
  ) {
    return res.status(401).json({ error: 'Token is not valid' });
  }

  try {
    const user = await User.findOne({ firebaseUid: decoded.uid });
    if (!user || user.tokenVersion !== decoded.tokenVersion) {
      return res.status(401).json({ error: 'Token is not valid' });
    }

    req.user = {
      uid: user.firebaseUid,
      email: user.email,
      id: user._id,
    };
    next();
  } catch (err) {
    console.error('Auth lookup error:', err);
    return res.status(500).json({ error: 'Server error' });
  }
};
