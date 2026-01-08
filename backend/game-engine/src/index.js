require('dotenv').config();

const express = require('express');
const Redis = require('ioredis');
const { v4: uuidv4 } = require('uuid');

const DiceGame = require('./games/dice');
const { SecureRNG } = require('./utils/rng');

const app = express();
const PORT = process.env.PORT || 3002;

// Redis client
const redis = new Redis({
  host: process.env.REDIS_HOST || 'localhost',
  port: process.env.REDIS_PORT || 6379,
});

const redisPublisher = new Redis({
  host: process.env.REDIS_HOST || 'localhost',
  port: process.env.REDIS_PORT || 6379,
});

// Initialize RNG
const rng = new SecureRNG();

// Initialize games
const games = {
  dice: new DiceGame(redis, redisPublisher, rng),
};

app.use(express.json());

// Health check
app.get('/health', (req, res) => {
  res.json({ success: true, message: 'Game Engine is running' });
});

// Place a bet (called by WebSocket service)
app.post('/bet', async (req, res) => {
  try {
    const { userId, gameId, amount, betData } = req.body;

    // Validate required fields
    if (!userId || !gameId || !amount) {
      return res.status(400).json({
        success: false,
        error: 'Missing required fields',
      });
    }

    // Validate amount
    if (amount <= 0) {
      return res.status(400).json({
        success: false,
        error: 'Invalid bet amount',
      });
    }

    // Get game type
    const gameType = await getGameType(gameId);

    if (!gameType || !games[gameType]) {
      return res.status(400).json({
        success: false,
        error: 'Game not found or not supported',
      });
    }

    // Process bet through wallet service first
    const walletResponse = await processBetTransaction(userId, amount, gameId);

    if (!walletResponse.success) {
      return res.status(400).json({
        success: false,
        error: walletResponse.error || 'Insufficient balance',
      });
    }

    // Place bet in game engine
    const bet = await games[gameType].placeBet({
      userId,
      gameId,
      amount,
      betData,
      transactionId: walletResponse.transactionId,
    });

    res.json({
      success: true,
      bet,
    });
  } catch (error) {
    console.error('Bet error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to place bet',
    });
  }
});

// Process game action (hit, stand, cashout, etc.)
app.post('/action', async (req, res) => {
  try {
    const { userId, gameId, action, data } = req.body;

    if (!userId || !gameId || !action) {
      return res.status(400).json({
        success: false,
        error: 'Missing required fields',
      });
    }

    const gameType = await getGameType(gameId);

    if (!gameType || !games[gameType]) {
      return res.status(400).json({
        success: false,
        error: 'Game not found',
      });
    }

    const result = await games[gameType].processAction({
      userId,
      gameId,
      action,
      data,
    });

    res.json({
      success: true,
      result,
    });
  } catch (error) {
    console.error('Action error:', error);
    res.status(500).json({
      success: false,
      error: error.message || 'Failed to process action',
    });
  }
});

// Get game state
app.get('/state/:gameId', async (req, res) => {
  try {
    const { gameId } = req.params;
    const state = await redis.get(`game_state:${gameId}`);

    res.json({
      success: true,
      state: state ? JSON.parse(state) : null,
    });
  } catch (error) {
    console.error('Get state error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to get game state',
    });
  }
});

// Generate provably fair result
app.post('/generate-result', async (req, res) => {
  try {
    const { gameType, serverSeed, clientSeed, nonce } = req.body;

    if (!games[gameType]) {
      return res.status(400).json({
        success: false,
        error: 'Invalid game type',
      });
    }

    const result = games[gameType].generateResult(serverSeed, clientSeed, nonce);

    res.json({
      success: true,
      result,
    });
  } catch (error) {
    console.error('Generate result error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to generate result',
    });
  }
});

// Verify provably fair result
app.post('/verify', async (req, res) => {
  try {
    const { gameType, serverSeed, clientSeed, nonce, expectedResult } = req.body;

    if (!games[gameType]) {
      return res.status(400).json({
        success: false,
        error: 'Invalid game type',
      });
    }

    const result = games[gameType].generateResult(serverSeed, clientSeed, nonce);
    const isValid = JSON.stringify(result) === JSON.stringify(expectedResult);

    res.json({
      success: true,
      isValid,
      calculatedResult: result,
    });
  } catch (error) {
    console.error('Verify error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to verify result',
    });
  }
});

// Helper functions
async function getGameType(gameId) {
  // Try to get from cache first
  let gameType = await redis.get(`game_type:${gameId}`);

  if (!gameType) {
    // Map common game slugs/ids to types
    const gameMap = {
      'classic-dice': 'dice',
    };

    gameType = gameMap[gameId];

    if (gameType) {
      await redis.set(`game_type:${gameId}`, gameType, 'EX', 3600);
    }
  }

  return gameType;
}

async function processBetTransaction(userId, amount, gameId) {
  try {
    const axios = require('axios');
    const WALLET_SERVICE_URL = process.env.WALLET_SERVICE_URL || 'http://wallet-service:3003';

    const response = await axios.post(`${WALLET_SERVICE_URL}/internal/bet`, {
      userId,
      amount,
      gameId,
      idempotencyKey: `bet:${uuidv4()}`,
    });

    return response.data;
  } catch (error) {
    console.error('Wallet transaction error:', error);
    return {
      success: false,
      error: error.response?.data?.error || 'Transaction failed',
    };
  }
}

app.listen(PORT, '0.0.0.0', () => {
  console.log(`Game Engine running on port ${PORT}`);
});

// Graceful shutdown
process.on('SIGTERM', async () => {
  console.log('SIGTERM received. Shutting down...');
  await redis.quit();
  await redisPublisher.quit();
  process.exit(0);
});
