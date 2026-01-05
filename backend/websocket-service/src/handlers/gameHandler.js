const axios = require('axios');

const GAME_ENGINE_URL = process.env.GAME_ENGINE_URL || 'http://game-engine:3002';

class GameHandler {
  constructor(io, redisClient, redisPublisher) {
    this.io = io;
    this.redis = redisClient;
    this.publisher = redisPublisher;
  }

  async joinGame(socket, { gameId, gameSlug }) {
    try {
      const roomKey = gameSlug || gameId;
      const room = `game:${roomKey}`;

      // Leave any previous game rooms
      const currentRooms = Array.from(socket.rooms);
      for (const r of currentRooms) {
        if (r.startsWith('game:') && r !== room) {
          socket.leave(r);
          await this.redis.srem(`game_players:${r}`, socket.userId);
        }
      }

      // Join new room
      socket.join(room);
      await this.redis.sadd(`game_players:${room}`, socket.userId);

      // Get current game state
      const gameState = await this.redis.get(`game_state:${roomKey}`);

      // Get player count
      const playerCount = await this.redis.scard(`game_players:${room}`);

      socket.emit('game:joined', {
        gameId: roomKey,
        state: gameState ? JSON.parse(gameState) : null,
        playerCount,
      });

      // Notify others
      socket.to(room).emit('game:player_joined', {
        userId: socket.userId,
        playerCount,
      });

      console.log(`User ${socket.userId} joined game ${roomKey}`);
    } catch (error) {
      console.error('Join game error:', error);
      socket.emit('error', { message: 'Failed to join game' });
    }
  }

  async leaveGame(socket, { gameId, gameSlug }) {
    try {
      const roomKey = gameSlug || gameId;
      const room = `game:${roomKey}`;

      socket.leave(room);
      await this.redis.srem(`game_players:${room}`, socket.userId);

      const playerCount = await this.redis.scard(`game_players:${room}`);

      socket.to(room).emit('game:player_left', {
        userId: socket.userId,
        playerCount,
      });

      socket.emit('game:left', { gameId: roomKey });
    } catch (error) {
      console.error('Leave game error:', error);
    }
  }

  async placeBet(socket, { gameId, amount, betData }) {
    try {
      console.log('placeBet called:', { userId: socket.userId, gameId, amount, betData });

      // Validate bet through game engine
      const response = await axios.post(`${GAME_ENGINE_URL}/bet`, {
        userId: socket.userId,
        gameId,
        amount,
        betData,
      });

      console.log('Game engine response:', response.data);

      if (!response.data.success) {
        socket.emit('bet:rejected', {
          reason: response.data.error,
        });
        return;
      }

      const bet = response.data.bet;
      const room = `game:${gameId}`;

      // Notify user bet is confirmed
      socket.emit('bet:confirmed', { bet });

      // Send result directly to the user (for instant games like dice/roulette)
      const result = {
        betId: bet.id,
        oddsId: gameId,
        won: bet.status === 'won',
        amount: bet.amount,
        winAmount: bet.actualWin || 0,
        multiplier: bet.multiplier,
        // Game-specific result data
        roll: bet.resultData?.roll,
        target: bet.betData?.target,
        condition: bet.betData?.condition,
        // Roulette specific
        winningNumber: bet.resultData?.winningNumber,
        winningColor: bet.resultData?.winningColor,
      };

      console.log('Sending game:result to user:', result);

      // Send result directly to the user who placed the bet
      socket.emit('game:result', { result });

      // Broadcast to game room that a bet was placed
      this.io.to(room).emit('bet:placed', {
        betId: bet.id,
        oddsId: socket.oddsId,
        amount: bet.amount,
        won: bet.status === 'won',
        winAmount: bet.actualWin || 0,
        timestamp: new Date().toISOString(),
      });

      // Publish for other instances
      this.publisher.publish('bet_events', JSON.stringify({
        room,
        betId: bet.id,
        oddsId: socket.oddsId,
        amount: bet.amount,
        gameId,
      }));
    } catch (error) {
      console.error('Place bet error:', error);
      socket.emit('bet:error', {
        message: error.response?.data?.error || 'Failed to place bet',
      });
    }
  }

  async gameAction(socket, { gameId, action, data }) {
    try {
      // Forward action to game engine
      const response = await axios.post(`${GAME_ENGINE_URL}/action`, {
        userId: socket.userId,
        gameId,
        action,
        data,
      });

      if (!response.data.success) {
        socket.emit('game:action_rejected', {
          action,
          reason: response.data.error,
        });
        return;
      }

      const result = response.data.result;

      // Send result to user
      socket.emit('game:action_result', {
        action,
        result,
      });

      // If game state changed, broadcast to room
      if (result.stateUpdate) {
        const room = `game:${gameId}`;
        this.io.to(room).emit('game:state_update', result.stateUpdate);
      }
    } catch (error) {
      console.error('Game action error:', error);
      socket.emit('game:action_error', {
        action,
        message: 'Failed to process action',
      });
    }
  }

  async handleDisconnect(socket) {
    try {
      // Get all game rooms the user was in
      const rooms = Array.from(socket.rooms);

      for (const room of rooms) {
        if (room.startsWith('game:')) {
          await this.redis.srem(`game_players:${room}`, socket.userId);

          const playerCount = await this.redis.scard(`game_players:${room}`);

          this.io.to(room).emit('game:player_left', {
            userId: socket.userId,
            playerCount,
          });
        }
      }
    } catch (error) {
      console.error('Handle disconnect error:', error);
    }
  }

  handleRedisEvent(data) {
    switch (data.type) {
      case 'game_result':
        this.io.to(`game:${data.gameId}`).emit('game:result', data.result);
        break;

      case 'round_start':
        this.io.to(`game:${data.gameId}`).emit('game:round_start', data.round);
        break;

      case 'round_end':
        this.io.to(`game:${data.gameId}`).emit('game:round_end', data.result);
        break;

      case 'crash_tick':
        this.io.to(`game:${data.gameId}`).emit('game:crash_tick', {
          multiplier: data.multiplier,
        });
        break;

      case 'crash_end':
        this.io.to(`game:${data.gameId}`).emit('game:crash_end', {
          crashPoint: data.crashPoint,
          winners: data.winners,
        });
        break;

      default:
        console.log('Unknown game event:', data.type);
    }
  }
}

module.exports = GameHandler;
