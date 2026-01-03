const { v4: uuidv4 } = require('uuid');

class ChatHandler {
  constructor(io, redisClient) {
    this.io = io;
    this.redis = redisClient;
    this.messageRateLimit = new Map();
  }

  async sendMessage(socket, { room, message, type = 'text' }) {
    try {
      // Rate limiting: 1 message per second
      const lastMessage = this.messageRateLimit.get(socket.userId);
      const now = Date.now();

      if (lastMessage && now - lastMessage < 1000) {
        socket.emit('chat:error', { message: 'You are sending messages too fast' });
        return;
      }

      this.messageRateLimit.set(socket.userId, now);

      // Validate message
      if (!message || typeof message !== 'string') {
        socket.emit('chat:error', { message: 'Invalid message' });
        return;
      }

      // Sanitize message (basic XSS prevention)
      const sanitizedMessage = message
        .trim()
        .slice(0, 500)
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;');

      if (!sanitizedMessage) {
        return;
      }

      // Get user info from cache
      const userInfo = await this.redis.get(`user:${socket.userId}`);
      const user = userInfo ? JSON.parse(userInfo) : { id: socket.userId };

      const chatMessage = {
        id: uuidv4(),
        userId: socket.userId,
        username: user.username || 'Anonymous',
        avatarUrl: user.avatarUrl,
        message: sanitizedMessage,
        type,
        room: room || 'lobby',
        timestamp: new Date().toISOString(),
      };

      // Store in Redis (keep last 100 messages per room)
      const roomKey = `chat:${room || 'lobby'}`;
      await this.redis.lpush(roomKey, JSON.stringify(chatMessage));
      await this.redis.ltrim(roomKey, 0, 99);

      // Broadcast to room
      this.io.to(room || 'lobby').emit('chat:message', chatMessage);
    } catch (error) {
      console.error('Send message error:', error);
      socket.emit('chat:error', { message: 'Failed to send message' });
    }
  }

  async joinRoom(socket, { room }) {
    try {
      // Leave previous chat rooms (except game rooms)
      const currentRooms = Array.from(socket.rooms);
      for (const r of currentRooms) {
        if (r.startsWith('chat:')) {
          socket.leave(r);
        }
      }

      const chatRoom = `chat:${room || 'lobby'}`;
      socket.join(chatRoom);

      // Also join the raw room name for game chat
      if (room && room !== 'lobby') {
        socket.join(room);
      }

      // Get recent messages
      const roomKey = `chat:${room || 'lobby'}`;
      const messages = await this.redis.lrange(roomKey, 0, 49);

      socket.emit('chat:joined', {
        room: room || 'lobby',
        messages: messages.map((m) => JSON.parse(m)).reverse(),
      });
    } catch (error) {
      console.error('Join room error:', error);
      socket.emit('chat:error', { message: 'Failed to join room' });
    }
  }

  async leaveRoom(socket, { room }) {
    try {
      socket.leave(`chat:${room}`);
      socket.leave(room);
      socket.emit('chat:left', { room });
    } catch (error) {
      console.error('Leave room error:', error);
    }
  }
}

module.exports = ChatHandler;
