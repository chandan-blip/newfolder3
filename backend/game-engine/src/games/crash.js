const { v4: uuidv4 } = require('uuid');

class CrashGame {
  constructor(redis, publisher, rng) {
    this.redis = redis;
    this.publisher = publisher;
    this.rng = rng;
    this.gameLoop = null;
    this.currentRound = null;
    this.tickInterval = 100; // ms
  }

  async startGameLoop() {
    console.log('Starting crash game loop...');
    this.runRound();
  }

  stopGameLoop() {
    if (this.gameLoop) {
      clearTimeout(this.gameLoop);
      this.gameLoop = null;
    }
  }

  async runRound() {
    try {
      // Wait between rounds (betting phase)
      await this.bettingPhase();

      // Start the round
      await this.playRound();

      // Schedule next round
      this.gameLoop = setTimeout(() => this.runRound(), 3000);
    } catch (error) {
      console.error('Crash round error:', error);
      this.gameLoop = setTimeout(() => this.runRound(), 5000);
    }
  }

  async bettingPhase() {
    const roundId = uuidv4();
    const serverSeed = this.rng.generateServerSeed();
    const serverSeedHash = this.rng.hashServerSeed(serverSeed);

    this.currentRound = {
      id: roundId,
      serverSeed,
      serverSeedHash,
      bets: [],
      status: 'betting',
      startTime: Date.now() + 10000, // 10 second betting phase
    };

    // Store round state
    await this.redis.set(
      'game_state:crash',
      JSON.stringify({
        roundId,
        serverSeedHash,
        status: 'betting',
        bettingEndsAt: this.currentRound.startTime,
      }),
      'EX',
      60
    );

    // Notify clients
    this.publisher.publish('game_events', JSON.stringify({
      type: 'round_start',
      gameId: 'crash',
      round: {
        id: roundId,
        serverSeedHash,
        status: 'betting',
        bettingEndsAt: this.currentRound.startTime,
      },
    }));

    // Wait for betting phase to end
    await new Promise((resolve) => setTimeout(resolve, 10000));
  }

  async playRound() {
    if (!this.currentRound) return;

    // Generate crash point
    const clientSeed = uuidv4().slice(0, 8);
    const hash = this.rng.generateResult(
      this.currentRound.serverSeed,
      clientSeed,
      1
    );
    const crashPoint = this.rng.generateCrashPoint(hash);

    this.currentRound.crashPoint = crashPoint;
    this.currentRound.clientSeed = clientSeed;
    this.currentRound.status = 'running';

    // Update state
    await this.redis.set(
      'game_state:crash',
      JSON.stringify({
        roundId: this.currentRound.id,
        status: 'running',
        startedAt: Date.now(),
      }),
      'EX',
      60
    );

    // Simulate multiplier increase
    let currentMultiplier = 1.00;
    const startTime = Date.now();
    const growthRate = 0.00006; // Adjust for speed

    while (currentMultiplier < crashPoint) {
      const elapsed = Date.now() - startTime;
      currentMultiplier = Math.min(
        crashPoint,
        Math.pow(Math.E, growthRate * elapsed)
      );

      currentMultiplier = Math.floor(currentMultiplier * 100) / 100;

      // Broadcast tick
      this.publisher.publish('game_events', JSON.stringify({
        type: 'crash_tick',
        gameId: 'crash',
        multiplier: currentMultiplier,
      }));

      await new Promise((resolve) => setTimeout(resolve, this.tickInterval));
    }

    // Round ended - crashed
    this.currentRound.status = 'crashed';

    // Process all remaining bets as losses
    const activeBets = await this.redis.smembers(`crash_bets:${this.currentRound.id}`);

    for (const betId of activeBets) {
      const bet = await this.redis.get(`bet:${betId}`);
      if (bet) {
        const betData = JSON.parse(bet);
        if (!betData.cashedOut) {
          betData.status = 'lost';
          betData.actualWin = 0;
          await this.redis.set(`bet:${betId}`, JSON.stringify(betData));
        }
      }
    }

    // Broadcast crash
    this.publisher.publish('game_events', JSON.stringify({
      type: 'crash_end',
      gameId: 'crash',
      crashPoint,
      serverSeed: this.currentRound.serverSeed,
      clientSeed,
    }));

    // Clean up
    await this.redis.del(`crash_bets:${this.currentRound.id}`);

    this.currentRound = null;
  }

  async placeBet({ userId, gameId, amount, betData, transactionId }) {
    if (!this.currentRound || this.currentRound.status !== 'betting') {
      throw new Error('Betting is closed');
    }

    // Check if user already has a bet this round
    const existingBet = await this.redis.get(
      `crash_user_bet:${this.currentRound.id}:${userId}`
    );

    if (existingBet) {
      throw new Error('You already have a bet this round');
    }

    const bet = {
      id: uuidv4(),
      roundId: this.currentRound.id,
      userId,
      amount,
      autoCashout: betData?.autoCashout || null,
      status: 'active',
      cashedOut: false,
      cashoutMultiplier: null,
      actualWin: 0,
      transactionId,
      placedAt: new Date().toISOString(),
    };

    // Store bet
    await this.redis.set(`bet:${bet.id}`, JSON.stringify(bet), 'EX', 300);
    await this.redis.sadd(`crash_bets:${this.currentRound.id}`, bet.id);
    await this.redis.set(
      `crash_user_bet:${this.currentRound.id}:${userId}`,
      bet.id,
      'EX',
      300
    );

    this.currentRound.bets.push(bet);

    return bet;
  }

  async processAction({ userId, gameId, action, data }) {
    if (action !== 'cashout') {
      throw new Error('Invalid action');
    }

    if (!this.currentRound || this.currentRound.status !== 'running') {
      throw new Error('No active round');
    }

    // Find user's bet
    const betId = await this.redis.get(
      `crash_user_bet:${this.currentRound.id}:${userId}`
    );

    if (!betId) {
      throw new Error('No active bet found');
    }

    const betData = await this.redis.get(`bet:${betId}`);

    if (!betData) {
      throw new Error('Bet not found');
    }

    const bet = JSON.parse(betData);

    if (bet.cashedOut) {
      throw new Error('Already cashed out');
    }

    // Get current multiplier (approximate)
    const startTime = Date.now() - (this.currentRound.startedAt || Date.now());
    const growthRate = 0.00006;
    let currentMultiplier = Math.pow(Math.E, growthRate * startTime);
    currentMultiplier = Math.floor(currentMultiplier * 100) / 100;

    // Make sure they haven't crashed
    if (currentMultiplier >= this.currentRound.crashPoint) {
      throw new Error('Round has already crashed');
    }

    // Process cashout
    const winAmount = bet.amount * currentMultiplier;

    bet.cashedOut = true;
    bet.cashoutMultiplier = currentMultiplier;
    bet.actualWin = winAmount;
    bet.status = 'won';
    bet.resolvedAt = new Date().toISOString();

    await this.redis.set(`bet:${betId}`, JSON.stringify(bet), 'EX', 300);

    // Process win
    await this.processWin(userId, winAmount, betId, gameId);

    // Broadcast cashout
    this.publisher.publish('game_events', JSON.stringify({
      type: 'cashout',
      gameId: 'crash',
      userId,
      multiplier: currentMultiplier,
      winAmount,
    }));

    return {
      success: true,
      multiplier: currentMultiplier,
      winAmount,
    };
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
    return this.rng.generateCrashPoint(hash);
  }
}

module.exports = CrashGame;
