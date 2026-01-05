const { v4: uuidv4 } = require('uuid');
const axios = require('axios');

const API_SERVICE_URL = process.env.API_SERVICE_URL || 'http://api-service-1:3000';

class DiceGame {
  constructor(redis, publisher, rng) {
    this.redis = redis;
    this.publisher = publisher;
    this.rng = rng;
  }

  async placeBet({ userId, gameId, amount, betData, transactionId }) {
    // Validate bet data
    const { target, condition } = betData || {};

    if (typeof target !== 'number' || target < 1 || target > 98) {
      throw new Error('Target must be between 1 and 98');
    }

    if (!['over', 'under'].includes(condition)) {
      throw new Error('Condition must be "over" or "under"');
    }

    // Calculate win chance and multiplier
    const winChance = condition === 'under' ? target : 100 - target;
    const houseEdge = 0.01; // 1% house edge
    const multiplier = ((100 - houseEdge * 100) / winChance).toFixed(4);

    // Generate provably fair result
    const serverSeed = this.rng.generateServerSeed();
    const serverSeedHash = this.rng.hashServerSeed(serverSeed);
    const clientSeed = betData.clientSeed || uuidv4().slice(0, 8);
    const nonce = await this.redis.incr(`dice_nonce:${userId}`);

    const hash = this.rng.generateResult(serverSeed, clientSeed, nonce);
    const roll = this.rng.generateDiceResult(hash);

    // Determine win/loss
    let won = false;
    if (condition === 'under') {
      won = roll < target;
    } else {
      won = roll > target;
    }

    const winAmount = won ? amount * parseFloat(multiplier) : 0;

    // Create bet record
    const bet = {
      id: uuidv4(),
      oddsId: gameId,
      userId,
      amount,
      betData: {
        target,
        condition,
        clientSeed,
        serverSeedHash,
        nonce,
      },
      resultData: {
        roll,
        serverSeed, // Will be revealed
      },
      multiplier: parseFloat(multiplier),
      potentialWin: amount * parseFloat(multiplier),
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
        userId,
        roll,
        target,
        condition,
        won,
        amount,
        winAmount,
        multiplier: parseFloat(multiplier),
      },
    }));

    return bet;
  }

  async processWin(userId, amount, betId, gameId) {
    try {
      const axios = require('axios');
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
    return this.rng.generateDiceResult(hash);
  }

  async processAction({ userId, gameId, action, data }) {
    // Dice doesn't have actions after bet
    throw new Error('Dice game does not support actions');
  }
}

module.exports = DiceGame;
