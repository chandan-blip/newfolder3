require('dotenv').config();

const express = require('express');
const { createServer } = require('http');
const { Server } = require('socket.io');
const cors = require('cors');
const Redis = require('ioredis');
const jwt = require('jsonwebtoken');

const GameHandler = require('./handlers/gameHandler');
const ChatHandler = require('./handlers/chatHandler');

const app = express();
const httpServer = createServer(app);

const PORT = process.env.PORT || 3001;
const JWT_SECRET = process.env.JWT_SECRET || 'your-super-secret-jwt-key';

// Redis clients for pub/sub
const redisSubscriber = new Redis({
  host: process.env.REDIS_HOST || 'localhost',
  port: process.env.REDIS_PORT || 6379,
});

const redisPublisher = new Redis({
  host: process.env.REDIS_HOST || 'localhost',
  port: process.env.REDIS_PORT || 6379,
});

const redisClient = new Redis({
  host: process.env.REDIS_HOST || 'localhost',
  port: process.env.REDIS_PORT || 6379,
});

// Socket.io server with Redis adapter
const io = new Server(httpServer, {
  cors: {
    origin: process.env.CORS_ORIGIN || '*',
    methods: ['GET', 'POST'],
    credentials: true,
  },
  pingTimeout: 60000,
  pingInterval: 25000,
  transports: ['websocket', 'polling'],
});

// Initialize handlers
const gameHandler = new GameHandler(io, redisClient, redisPublisher);
const chatHandler = new ChatHandler(io, redisClient);

// Authentication middleware
io.use(async (socket, next) => {
  try {
    const token = socket.handshake.auth.token || socket.handshake.query.token;

    if (!token) {
      return next(new Error('Authentication required'));
    }

    // Verify JWT
    const decoded = jwt.verify(token, JWT_SECRET);

    // Check if token is blacklisted
    const isBlacklisted = await redisClient.get(`blacklist:${token}`);
    if (isBlacklisted) {
      return next(new Error('Token has been revoked'));
    }

    // Attach user info to socket
    socket.userId = decoded.userId;
    socket.token = token;

    next();
  } catch (error) {
    if (error.name === 'TokenExpiredError') {
      return next(new Error('Token expired'));
    }
    return next(new Error('Invalid token'));
  }
});

// Connection handling
io.on('connection', async (socket) => {
  console.log(`User connected: ${socket.userId}`);

  // Track online users
  await redisClient.sadd('online_users', socket.userId);
  await redisClient.hset(`user_sockets:${socket.userId}`, socket.id, Date.now());

  // Join user's personal room
  socket.join(`user:${socket.userId}`);

  // Broadcast online count
  const onlineCount = await redisClient.scard('online_users');
  io.emit('online_count', { count: onlineCount });

  // Game events
  socket.on('game:join', (data) => gameHandler.joinGame(socket, data));
  socket.on('game:leave', (data) => gameHandler.leaveGame(socket, data));
  socket.on('game:bet', (data) => gameHandler.placeBet(socket, data));
  socket.on('game:action', (data) => gameHandler.gameAction(socket, data));

  // Chat events
  socket.on('chat:message', (data) => chatHandler.sendMessage(socket, data));
  socket.on('chat:join_room', (data) => chatHandler.joinRoom(socket, data));
  socket.on('chat:leave_room', (data) => chatHandler.leaveRoom(socket, data));

  // Disconnect handling
  socket.on('disconnect', async () => {
    console.log(`User disconnected: ${socket.userId}`);

    // Remove socket from user's socket list
    await redisClient.hdel(`user_sockets:${socket.userId}`, socket.id);

    // Check if user has other active sockets
    const remainingSockets = await redisClient.hlen(`user_sockets:${socket.userId}`);

    if (remainingSockets === 0) {
      // User is completely offline
      await redisClient.srem('online_users', socket.userId);

      // Notify game rooms
      gameHandler.handleDisconnect(socket);
    }

    // Broadcast updated online count
    const onlineCount = await redisClient.scard('online_users');
    io.emit('online_count', { count: onlineCount });
  });

  // Error handling
  socket.on('error', (error) => {
    console.error(`Socket error for user ${socket.userId}:`, error);
  });
});

// Redis pub/sub for cross-instance communication
redisSubscriber.subscribe('game_events', 'bet_events', 'chat_events');

redisSubscriber.on('message', (channel, message) => {
  try {
    const data = JSON.parse(message);

    switch (channel) {
      case 'game_events':
        gameHandler.handleRedisEvent(data);
        break;
      case 'bet_events':
        io.to(data.room || 'lobby').emit('bet:new', data);
        break;
      case 'chat_events':
        io.to(data.room).emit('chat:message', data);
        break;
    }
  } catch (error) {
    console.error('Redis message error:', error);
  }
});

// Health check endpoint
app.get('/health', (req, res) => {
  res.json({
    success: true,
    message: 'WebSocket service is running',
    connections: io.engine.clientsCount,
  });
});

// Start server
httpServer.listen(PORT, '0.0.0.0', () => {
  console.log(`WebSocket Service running on port ${PORT}`);
});

// Graceful shutdown
process.on('SIGTERM', async () => {
  console.log('SIGTERM received. Closing connections...');

  // Close all sockets
  io.close();

  // Close Redis connections
  await redisSubscriber.quit();
  await redisPublisher.quit();
  await redisClient.quit();

  process.exit(0);
});
