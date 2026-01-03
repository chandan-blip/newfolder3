require('dotenv').config();

const express = require('express');
const cors = require('cors');
const helmet = require('helmet');

const { connectDatabase } = require('./config/database');
const { connectRedis } = require('./config/redis');
const walletRoutes = require('./routes/wallet.routes');

const app = express();
const PORT = process.env.PORT || 3003;

// Security middleware
app.use(helmet());
app.use(cors());
app.use(express.json());

// Health check
app.get('/health', (req, res) => {
  res.json({ success: true, message: 'Wallet Service is running' });
});

// Internal routes (called by other services)
app.use('/internal', walletRoutes);

// Error handling
app.use((err, req, res, next) => {
  console.error('Error:', err);
  res.status(err.status || 500).json({
    success: false,
    error: err.message || 'Internal server error',
  });
});

// Start server
const startServer = async () => {
  try {
    await connectDatabase();
    console.log('Database connected');

    await connectRedis();
    console.log('Redis connected');

    app.listen(PORT, '0.0.0.0', () => {
      console.log(`Wallet Service running on port ${PORT}`);
    });
  } catch (error) {
    console.error('Failed to start server:', error);
    process.exit(1);
  }
};

process.on('SIGTERM', () => {
  console.log('SIGTERM received. Shutting down gracefully...');
  process.exit(0);
});

startServer();
