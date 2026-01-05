const { v4: uuidv4 } = require('uuid');
const axios = require('axios');

const API_SERVICE_URL = process.env.API_SERVICE_URL || 'http://api-service-1:3000';

// Slot symbols with their weights (higher weight = more common)
const SYMBOLS = [
  { id: 'grape', weight: 25, multiplier: 2 },
  { id: 'orange', weight: 22, multiplier: 3 },
  { id: 'lemon', weight: 18, multiplier: 5 },
  { id: 'cherry', weight: 14, multiplier: 10 },
  { id: 'bell', weight: 10, multiplier: 15 },
  { id: 'crown', weight: 6, multiplier: 25 },
  { id: 'diamond', weight: 4, multiplier: 50 },
  { id: 'seven', weight: 1, multiplier: 100 },
];

// Calculate total weight for probability calculation
const TOTAL_WEIGHT = SYMBOLS.reduce((sum, s) => sum + s.weight, 0);

class SlotsGame {
  constructor(redis, publisher, rng) {
    this.redis = redis;
    this.publisher = publisher;
    this.rng = rng;
    this.symbols = SYMBOLS;
    this.totalWeight = TOTAL_WEIGHT;
  }

  // Get random symbol based on weighted probability
  getRandomSymbol(hash, offset = 0) {
    // Use different parts of the hash for each reel
    const hexValue = hash.slice(offset * 8, offset * 8 + 8);
    const intValue = parseInt(hexValue, 16);
    const randomValue = intValue % this.totalWeight;

    let cumulativeWeight = 0;
    for (const symbol of this.symbols) {
      cumulativeWeight += symbol.weight;
      if (randomValue < cumulativeWeight) {
        return symbol;
      }
    }

    return this.symbols[0]; // Fallback
  }

  // Calculate payout based on matching symbols
  calculatePayout(reels) {
    const [reel1, reel2, reel3] = reels;

    // Three of a kind - full multiplier
    if (reel1.id === reel2.id && reel2.id === reel3.id) {
      return {
        won: true,
        multiplier: reel1.multiplier,
        matchType: 'triple',
        matchedSymbol: reel1.id,
      };
    }

    // Two of a kind - half multiplier
    if (reel1.id === reel2.id || reel2.id === reel3.id || reel1.id === reel3.id) {
      let matchedSymbol;
      if (reel1.id === reel2.id) matchedSymbol = reel1;
      else if (reel2.id === reel3.id) matchedSymbol = reel2;
      else matchedSymbol = reel1;

      return {
        won: true,
        multiplier: Math.max(0.5, matchedSymbol.multiplier * 0.1),
        matchType: 'double',
        matchedSymbol: matchedSymbol.id,
      };
    }

    // No match
    return {
      won: false,
      multiplier: 0,
      matchType: 'none',
      matchedSymbol: null,
    };
  }

  async placeBet({ userId, gameId, amount, betData, transactionId }) {
    const { clientSeed } = betData || {};

    // Generate provably fair result
    const serverSeed = this.rng.generateServerSeed();
    const serverSeedHash = this.rng.hashServerSeed(serverSeed);
    const finalClientSeed = clientSeed || uuidv4().slice(0, 8);
    const nonce = await this.redis.incr(`slots_nonce:${userId}`);

    const hash = this.rng.generateResult(serverSeed, finalClientSeed, nonce);

    // Generate 3 reel results
    const reels = [
      this.getRandomSymbol(hash, 0),
      this.getRandomSymbol(hash, 1),
      this.getRandomSymbol(hash, 2),
    ];

    const reelIds = reels.map(r => r.id);

    // Calculate payout
    const { won, multiplier, matchType, matchedSymbol } = this.calculatePayout(reels);
    const winAmount = won ? amount * multiplier : 0;

    const bet = {
      id: uuidv4(),
      oddsId: gameId,
      userId,
      amount,
      betData: {
        clientSeed: finalClientSeed,
        serverSeedHash,
        nonce,
      },
      resultData: {
        reels: reelIds,
        matchType,
        matchedSymbol,
        serverSeed,
      },
      multiplier: multiplier,
      potentialWin: amount * 100, // Max potential (triple 7s)
      actualWin: winAmount,
      status: won ? 'won' : 'lost',
      placedAt: new Date().toISOString(),
      resolvedAt: new Date().toISOString(),
      transactionId,
    };

    // Process win if applicable
    if (won && winAmount > 0) {
      await this.processWin(userId, winAmount, bet.id, gameId);
    }

    // Save bet to database
    try {
      await axios.post(`${API_SERVICE_URL}/api/games/internal/save-bet`, bet);
    } catch (error) {
      console.error('Failed to save bet to database:', error.message);
    }

    // Publish result
    this.publisher.publish('game_events', JSON.stringify({
      type: 'game_result',
      gameId,
      result: {
        betId: bet.id,
        oddsId: gameId,
        oddsType: 'slots',
        userId,
        reels: reelIds,
        matchType,
        matchedSymbol,
        won,
        amount,
        winAmount,
        multiplier,
      },
    }));

    return bet;
  }

  async processWin(userId, amount, betId, gameId) {
    try {
      const WALLET_SERVICE_URL = process.env.WALLET_SERVICE_URL || 'http://wallet-service:3003';

      await axios.post(`${WALLET_SERVICE_URL}/internal/win`, {
        userId,
        amount,
        referenceId: betId,
        gameId,
        idempotencyKey: `win:${betId}`,
      });
    } catch (error) {
      console.error('Process win error:', error);
    }
  }

  generateResult(serverSeed, clientSeed, nonce) {
    const hash = this.rng.generateResult(serverSeed, clientSeed, nonce);
    const reels = [
      this.getRandomSymbol(hash, 0),
      this.getRandomSymbol(hash, 1),
      this.getRandomSymbol(hash, 2),
    ];
    return reels.map(r => r.id);
  }

  async processAction({ userId, gameId, action, data }) {
    throw new Error('Slots does not support actions');
  }
}

module.exports = SlotsGame;
