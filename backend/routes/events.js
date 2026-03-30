const express = require('express');
const router = express.Router();
const Event = require('../models/Event');

// CREATE - Add a new event
router.post('/', async (req, res, next) => {
  try {
    console.log('\n📥 Incoming POST request body:', req.body);
    const newEvent = new Event(req.body);
    const savedEvent = await newEvent.save();
    console.log('✅ Successfully saved to DB:', savedEvent);
    res.status(201).json({ success: true, data: savedEvent });
  } catch (error) {
    console.error('❌ Error saving event:', error.message);
    next(error);
  }
});

// READ - Get all events
router.get('/', async (req, res, next) => {
  try {
    console.log('\n🔍 Fetching all events from DB...');
    const events = await Event.find().sort({ date: 1 });
    console.log(`✅ Found ${events.length} events.`);
    res.status(200).json({ success: true, count: events.length, data: events });
  } catch (error) {
    console.error('❌ Error fetching events:', error.message);
    next(error);
  }
});

// READ - Get a single event by ID
router.get('/:id', async (req, res, next) => {
  try {
    const event = await Event.findById(req.params.id);
    if (!event) return res.status(404).json({ success: false, message: 'Event not found' });
    res.status(200).json({ success: true, data: event });
  } catch (error) {
    next(error);
  }
});

// UPDATE - Edit an existing event
router.put('/:id', async (req, res, next) => {
  try {
    const updatedEvent = await Event.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
    if (!updatedEvent) return res.status(404).json({ success: false, message: 'Event not found' });
    res.status(200).json({ success: true, data: updatedEvent });
  } catch (error) {
    next(error);
  }
});

// DELETE - Remove an event
router.delete('/:id', async (req, res, next) => {
  try {
    const deletedEvent = await Event.findByIdAndDelete(req.params.id);
    if (!deletedEvent) return res.status(404).json({ success: false, message: 'Event not found' });
    res.status(200).json({ success: true, message: 'Event deleted successfully' });
  } catch (error) {
    next(error);
  }
});

module.exports = router;
