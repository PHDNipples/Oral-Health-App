// backend/middleware/authMiddleware.js
const jwt = require('jsonwebtoken');
if (!process.env.JWT_SECRET) {
  throw new Error('JWT_SECRET environment variable is not set');
}
const JWT_SECRET = process.env.JWT_SECRET;
module.exports = (req, res, next) => {
  const authHeader = req.header('Authorization');
  const token = authHeader && authHeader.startsWith('Bearer ')
    ? authHeader.split(' ')[1]
    : null;

  if (!token) return res.status(401).json({ error: 'No token, authorization denied' });

  try {
    // Verify backend JWT (not Firebase token)
    const decoded = jwt.verify(token, JWT_SECRET);
    req.user = decoded; // { uid, email }
    next();
  } catch (err) {
    console.error('Backend JWT verification failed:', err);
    res.status(401).json({ error: 'Token is not valid' });
  }
};
