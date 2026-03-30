const express = require('express');
const router = express.Router();
const Registration = require('../models/Registration');
const Event = require('../models/Event');

// REGISTER FOR AN EVENT
router.post('/', async (req, res, next) => {
  try {
    const { userId, eventId } = req.body;
    const event = await Event.findById(eventId);
    if (!event) return res.status(404).json({ success: false, message: 'Event not found' });

    if (event.spotsFilled >= event.totalCapacity) {
      return res.status(400).json({ success: false, message: 'Event is full' });
    }

    const existing = await Registration.findOne({ user: userId, event: eventId });
    if (existing) return res.status(400).json({ success: false, message: 'Already registered for this event' });

    const newReg = new Registration({ user: userId, event: eventId });
    await newReg.save();

    event.spotsFilled += 1;
    await event.save();

    res.status(201).json({ success: true, data: newReg });
  } catch (error) {
    next(error);
  }
});

// GET ALL REGISTRATIONS (filter by user or event)
router.get('/', async (req, res, next) => {
  try {
    const { userId, eventId } = req.query;
    let query = {};
    if (userId) query.user = userId;
    if (eventId) query.event = eventId;

    const regs = await Registration.find(query)
      .populate('user', 'name email gr enroll')
      .populate('event', 'title date time location image status totalCapacity spotsFilled');

    res.status(200).json({ success: true, data: regs });
  } catch (error) {
    next(error);
  }
});

// DELETE REGISTRATION
router.delete('/:id', async (req, res, next) => {
  try {
    const deleted = await Registration.findByIdAndDelete(req.params.id);
    if (deleted) {
      await Event.findByIdAndUpdate(deleted.event, { $inc: { spotsFilled: -1 } });
    }
    res.status(200).json({ success: true, message: 'Registration deleted' });
  } catch (error) {
    next(error);
  }
});

// UPDATE REGISTRATION
router.put('/:id', async (req, res, next) => {
  try {
    const updated = await Registration.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.status(200).json({ success: true, data: updated });
  } catch (error) {
    next(error);
  }
});

module.exports = router;
