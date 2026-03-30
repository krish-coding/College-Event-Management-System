const express = require('express');
const router = express.Router();
const User = require('../models/User');

// GET /api/users - Get all students
router.get('/', async (req, res, next) => {
  try {
    const users = await User.find({ role: 'student' });
    res.status(200).json({ success: true, data: users });
  } catch (error) {
    next(error);
  }
});

// DELETE /api/users/:id
router.delete('/:id', async (req, res, next) => {
  try {
    await User.findByIdAndDelete(req.params.id);
    res.status(200).json({ success: true, message: 'User deleted' });
  } catch (error) {
    next(error);
  }
});

// PUT /api/users/:id
router.put('/:id', async (req, res, next) => {
  try {
    const updated = await User.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.status(200).json({ success: true, data: updated });
  } catch (error) {
    next(error);
  }
});

module.exports = router;
