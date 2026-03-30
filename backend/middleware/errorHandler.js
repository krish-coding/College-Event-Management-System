module.exports = (err, req, res, next) => {
  console.error('⚠️ Global Error Handler Caught:', err.message);

  if (err.name === 'ValidationError') {
    const messages = Object.values(err.errors).map(val => val.message);
    return res.status(400).json({ success: false, message: 'Validation Error', errors: messages });
  }

  if (err.name === 'CastError' && err.kind === 'ObjectId') {
    return res.status(400).json({ success: false, message: 'Invalid ID format' });
  }

  res.status(500).json({
    success: false,
    message: err.message || 'Internal Server Error'
  });
};
