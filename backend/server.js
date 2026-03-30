const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

// Routes
const eventRoutes = require('./routes/events');
const authRoutes = require('./routes/auth');
const userRoutes = require('./routes/users');
const registrationRoutes = require('./routes/registrations');
const errorHandler = require('./middleware/errorHandler');

const app = express();

// Middleware
app.use(cors());
app.use(express.json({ limit: '10mb' })); // Increased limit for base64 images

// Database Connection
const MONGO_URI = process.env.MONGO_URI;
mongoose.connect(MONGO_URI)
  .then(() => console.log('✅ Connected to MongoDB successfully!'))
  .catch((err) => console.error('❌ MongoDB connection error:', err));

// Health route
app.get('/', (req, res) => {
  res.send('Backend is running');
});

// Mount Routes
app.use('/api/events', eventRoutes);
app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/registrations', registrationRoutes);

// Global Error Handler
app.use(errorHandler);

// Start Server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🚀 Backend Server running on http://localhost:${PORT}`);
});
