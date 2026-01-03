const Redis = require('ioredis');

const redisClient = new Redis({
  host: process.env.REDIS_HOST || 'localhost',
  port: process.env.REDIS_PORT || 6379,
  maxRetriesPerRequest: 3,
  lazyConnect: true,
});

const connectRedis = async () => {
  await redisClient.connect();
  return true;
};

module.exports = { redisClient, connectRedis };
