const express = require('express');
const router = express.Router();
const User = require('../models/User');

// POST /api/auth/register
router.post('/register', async (req, res, next) => {
  try {
    const { name, email, gr, enroll, password, role } = req.body;
    const existing = await User.findOne({ email });
    if (existing) return res.status(400).json({ success: false, message: 'Email already exists' });
    const user = new User({ name, email, gr, enroll, password, role });
    await user.save();
    res.status(201).json({ success: true, data: user });
  } catch (error) {
    next(error);
  }
});

// POST /api/auth/login
router.post('/login', async (req, res, next) => {
  try {
    const { email, password } = req.body;
    // Hardcoded Admin login bypass
    if (email === 'admin@marwadiuniversity.ac.in' && password === 'Admin123') {
      return res.status(200).json({ success: true, data: { _id: 'admin123', name: 'Admin User', email: 'admin@marwadiuniversity.ac.in', role: 'admin' } });
    }
    const user = await User.findOne({ email, password });
    if (!user) return res.status(401).json({ success: false, message: 'Invalid credentials' });
    res.status(200).json({ success: true, data: user });
  } catch (error) {
    next(error);
  }
});

module.exports = router;
