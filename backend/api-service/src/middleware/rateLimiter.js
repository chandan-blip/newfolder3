const rateLimit = require('express-rate-limit');
const { redisClient } = require('../config/redis');

// Custom Redis store for rate limiting
class RedisStore {
  constructor(options = {}) {
    this.prefix = options.prefix || 'rl:';
    this.resetExpiryOnChange = options.resetExpiryOnChange || false;
  }

  async increment(key) {
    const redisKey = this.prefix + key;
    const multi = redisClient.multi();
    multi.incr(redisKey);
    multi.pttl(redisKey);

    const results = await multi.exec();
    const totalHits = results[0][1];
    const pttl = results[1][1];

    return {
      totalHits,
      resetTime: pttl > 0 ? new Date(Date.now() + pttl) : undefined,
    };
  }

  async decrement(key) {
    await redisClient.decr(this.prefix + key);
  }

  async resetKey(key) {
    await redisClient.del(this.prefix + key);
  }
}

// General API rate limiter
const apiLimiter = rateLimit({
  windowMs: 60 * 1000, // 1 minute
  max: 100, // 100 requests per minute
  message: {
    success: false,
    error: 'Too many requests, please try again later',
    code: 'RATE_LIMITED',
  },
  standardHeaders: true,
  legacyHeaders: false,
  keyGenerator: (req) => {
    return req.user?.id || req.ip;
  },
});

// Stricter limiter for auth endpoints
const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 10, // 10 attempts per 15 minutes
  message: {
    success: false,
    error: 'Too many authentication attempts, please try again later',
    code: 'AUTH_RATE_LIMITED',
  },
  standardHeaders: true,
  legacyHeaders: false,
  skipSuccessfulRequests: true,
});

// Wallet operations limiter
const walletLimiter = rateLimit({
  windowMs: 60 * 1000, // 1 minute
  max: 30, // 30 requests per minute
  message: {
    success: false,
    error: 'Too many wallet requests, please slow down',
    code: 'WALLET_RATE_LIMITED',
  },
  standardHeaders: true,
  legacyHeaders: false,
  keyGenerator: (req) => {
    return `wallet:${req.user?.id || req.ip}`;
  },
});

// Betting limiter
const betLimiter = rateLimit({
  windowMs: 1000, // 1 second
  max: 5, // 5 bets per second
  message: {
    success: false,
    error: 'Betting too fast, please slow down',
    code: 'BET_RATE_LIMITED',
  },
  standardHeaders: true,
  legacyHeaders: false,
  keyGenerator: (req) => {
    return `bet:${req.user?.id || req.ip}`;
  },
});

module.exports = {
  apiLimiter,
  authLimiter,
  walletLimiter,
  betLimiter,
};
