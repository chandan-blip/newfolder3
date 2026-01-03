const { v4: uuidv4 } = require('uuid');

class RouletteGame {
  constructor(redis, publisher, rng) {
    this.redis = redis;
    this.publisher = publisher;
    this.rng = rng;

    // European roulette numbers and colors
    this.numbers = Array.from({ length: 37 }, (_, i) => i); // 0-36
    this.redNumbers = [1, 3, 5, 7, 9, 12, 14, 16, 18, 19, 21, 23, 25, 27, 30, 32, 34, 36];
    this.blackNumbers = [2, 4, 6, 8, 10, 11, 13, 15, 17, 20, 22, 24, 26, 28, 29, 31, 33, 35];
  }

  getNumberColor(number) {
    if (number === 0) return 'green';
    return this.redNumbers.includes(number) ? 'red' : 'black';
  }

  calculatePayout(betType, betValue, winningNumber) {
    const isEven = winningNumber !== 0 && winningNumber % 2 === 0;
    const isOdd = winningNumber !== 0 && winningNumber % 2 === 1;
    const color = this.getNumberColor(winningNumber);
    const isLow = winningNumber >= 1 && winningNumber <= 18;
    const isHigh = winningNumber >= 19 && winningNumber <= 36;
    const column = winningNumber === 0 ? 0 : ((winningNumber - 1) % 3) + 1;
    const dozen = winningNumber === 0 ? 0 : Math.ceil(winningNumber / 12);

    switch (betType) {
      case 'straight':
        // Single number bet (35:1)
        return parseInt(betValue) === winningNumber ? 36 : 0;

      case 'split':
        // Two adjacent numbers (17:1)
        const splitNumbers = betValue.split(',').map(Number);
        return splitNumbers.includes(winningNumber) ? 18 : 0;

      case 'street':
        // Three numbers in a row (11:1)
        const streetStart = parseInt(betValue);
        return winningNumber >= streetStart && winningNumber <= streetStart + 2 ? 12 : 0;

      case 'corner':
        // Four numbers in a square (8:1)
        const cornerNumbers = betValue.split(',').map(Number);
        return cornerNumbers.includes(winningNumber) ? 9 : 0;

      case 'line':
        // Six numbers (5:1)
        const lineStart = parseInt(betValue);
        return winningNumber >= lineStart && winningNumber <= lineStart + 5 ? 6 : 0;

      case 'column':
        // Column bet (2:1)
        return column === parseInt(betValue) ? 3 : 0;

      case 'dozen':
        // Dozen bet (2:1)
        return dozen === parseInt(betValue) ? 3 : 0;

      case 'red':
        return color === 'red' ? 2 : 0;

      case 'black':
        return color === 'black' ? 2 : 0;

      case 'even':
        return isEven ? 2 : 0;

      case 'odd':
        return isOdd ? 2 : 0;

      case 'low':
        return isLow ? 2 : 0;

      case 'high':
        return isHigh ? 2 : 0;

      default:
        return 0;
    }
  }

  async placeBet({ userId, gameId, amount, betData, transactionId }) {
    const { betType, betValue, clientSeed } = betData || {};

    // Validate bet type
    const validBetTypes = [
      'straight', 'split', 'street', 'corner', 'line',
      'column', 'dozen', 'red', 'black', 'even', 'odd', 'low', 'high'
    ];

    if (!validBetTypes.includes(betType)) {
      throw new Error('Invalid bet type');
    }

    // Generate provably fair result
    const serverSeed = this.rng.generateServerSeed();
    const serverSeedHash = this.rng.hashServerSeed(serverSeed);
    const finalClientSeed = clientSeed || uuidv4().slice(0, 8);
    const nonce = await this.redis.incr(`roulette_nonce:${userId}`);

    const hash = this.rng.generateResult(serverSeed, finalClientSeed, nonce);
    const winningNumber = this.rng.generateRouletteNumber(hash);
    const winningColor = this.getNumberColor(winningNumber);

    // Calculate payout
    const payoutMultiplier = this.calculatePayout(betType, betValue, winningNumber);
    const won = payoutMultiplier > 0;
    const winAmount = won ? amount * payoutMultiplier : 0;

    const bet = {
      id: uuidv4(),
      gameId,
      userId,
      amount,
      betData: {
        betType,
        betValue,
        clientSeed: finalClientSeed,
        serverSeedHash,
        nonce,
      },
      resultData: {
        winningNumber,
        winningColor,
        serverSeed,
      },
      multiplier: payoutMultiplier,
      potentialWin: amount * payoutMultiplier,
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

    // Publish result
    this.publisher.publish('game_events', JSON.stringify({
      type: 'game_result',
      gameId,
      result: {
        betId: bet.id,
        userId,
        winningNumber,
        winningColor,
        betType,
        betValue,
        won,
        amount,
        winAmount,
        multiplier: payoutMultiplier,
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
    return this.rng.generateRouletteNumber(hash);
  }

  async processAction({ userId, gameId, action, data }) {
    throw new Error('Roulette does not support actions');
  }
}

module.exports = RouletteGame;
