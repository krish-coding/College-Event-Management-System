const mongoose = require('mongoose');

const registrationSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  event: { type: mongoose.Schema.Types.ObjectId, ref: 'Event', required: true },
  ticketId: { type: String, unique: true },
  status: { type: String, enum: ['Confirmed', 'Pending', 'Cancelled'], default: 'Confirmed' }
}, { timestamps: true });

// Pre-save hook to generate a random ticket ID
registrationSchema.pre('save', function () {
  if (!this.ticketId) {
    this.ticketId = 'TKT-' + Math.floor(1000 + Math.random() * 9000);
  }
});

module.exports = mongoose.model('Registration', registrationSchema);
