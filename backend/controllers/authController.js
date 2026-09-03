// backend/controllers/authController.js
const crypto = require('crypto');
const bcrypt = require('bcryptjs');
const admin = require('../utils/firebase');
const jwt = require('jsonwebtoken');
const User = require('../models/User');

exports.loginFirebase = async (req, res) => {
  const { idToken } = req.body;

  if (!idToken) return res.status(400).json({ error: 'No ID token provided' });

  try {
    const decodedToken = await admin.auth().verifyIdToken(idToken);
    const { uid, email, name } = decodedToken;

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
    } else {
      if (!user.firebaseUid) user.firebaseUid = uid;
      if (!user.name && name) user.name = name;
      if (user.email !== email) user.email = email;
      await user.save();
    }

    const token = jwt.sign({ uid, email }, process.env.JWT_SECRET, {
      expiresIn: '7d',
    });

    res.json({
      token,
      user: { id: user._id, uid, name: user.name, email: user.email },
    });
  } catch (err) {
    console.error('Firebase login failed:', err);
    res.status(401).json({ error: 'Invalid Firebase ID token' });
  }
};
