const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const mongoose = require('mongoose');
const path = require('path');

// Load environment variables
dotenv.config();

// Initialize Express app
const app = express();
const PORT = process.env.PORT || 5000;

// Connect to MongoDB
mongoose.connect(process.env.MONGO_URI || 'mongodb://localhost:27017/web3app')
  .then(() => console.log('MongoDB Connected'))
  .catch(err => console.error('MongoDB Connection Error:', err));

// Middleware
app.use(cors());
app.use(express.json());

// Serve static files from uploads directory
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Import routes
const transactionRoutes = require('./routes/transactions');
const authRoutes = require('./routes/auth');
const postsRoutes = require('./routes/posts');
const membershipPlansRoutes = require('./routes/membershipPlans');
const merchandiseRoutes = require('./routes/merchandise');

// Use routes
app.use('/api/transactions', transactionRoutes);
app.use('/api/auth', authRoutes);
app.use('/api/posts', postsRoutes);
app.use('/api/membership-plans', membershipPlansRoutes);
app.use('/api/merchandise', merchandiseRoutes);

// Root route
app.get('/', (req, res) => {
  res.json({ message: 'Welcome to Web3.0 Backend API' });
});

// Start server
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
