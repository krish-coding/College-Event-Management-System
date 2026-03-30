const mongoose = require('mongoose');

const eventSchema = new mongoose.Schema({
  title: { type: String, required: [true, 'Event title is required'], trim: true },
  category: { type: String, required: true, enum: ['Technical', 'Cultural', 'Sports', 'Workshop', 'Business'] },
  organizer: { type: String, required: true },
  date: { type: Date, required: true },
  time: { type: String, required: true },
  location: { type: String, required: true },
  totalCapacity: { type: Number, required: true, min: 1 },
  spotsFilled: { type: Number, default: 0 },
  price: { type: String, default: 'Free' },
  description: { type: String, required: true },
  image: { type: String },
  createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  status: { type: String, enum: ['Published', 'Draft', 'Closed'], default: 'Published' }
}, { timestamps: true });

module.exports = mongoose.model('Event', eventSchema);
