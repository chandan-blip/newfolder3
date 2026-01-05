import { io } from 'socket.io-client';

const SOCKET_URL = import.meta.env.VITE_SOCKET_URL || '';

class SocketService {
  constructor() {
    this.socket = null;
    this.listeners = new Map();
  }

  connect(token) {
    if (this.socket?.connected) {
      return this.socket;
    }

    this.socket = io(SOCKET_URL, {
      auth: { token },
      transports: ['websocket', 'polling'],
      reconnection: true,
      reconnectionAttempts: 5,
      reconnectionDelay: 1000,
    });

    return this.socket;
  }

  disconnect() {
    if (this.socket) {
      this.socket.disconnect();
      this.socket = null;
    }
  }

  // Game events
  joinGame(gameId) {
    this.socket?.emit('game:join', { gameSlug: gameId });
  }

  leaveGame(gameId) {
    this.socket?.emit('game:leave', { gameSlug: gameId });
  }

  placeBet(gameId, amount, betData) {
    if (!this.socket?.connected) {
      return;
    }
    this.socket.emit('game:bet', { gameId, amount, betData });
  }

  gameAction(gameId, action, data) {
    this.socket?.emit('game:action', { gameId, action, data });
  }

  // Chat events
  joinChatRoom(room) {
    this.socket?.emit('chat:join_room', { room });
  }

  leaveChatRoom(room) {
    this.socket?.emit('chat:leave_room', { room });
  }

  sendMessage(room, message) {
    this.socket?.emit('chat:message', { room, message });
  }

  // Event listeners
  on(event, callback) {
    if (!this.listeners.has(event)) {
      this.listeners.set(event, new Set());
    }
    this.listeners.get(event).add(callback);
    this.socket?.on(event, callback);
  }

  off(event, callback) {
    this.listeners.get(event)?.delete(callback);
    this.socket?.off(event, callback);
  }

  // Utility
  isConnected() {
    return this.socket?.connected || false;
  }
}

export const socketService = new SocketService();
export default socketService;
