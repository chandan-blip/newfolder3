const { Game, Bet, User } = require('../models');
const { cacheGet, cacheSet } = require('../config/redis');

class GameService {
  async getGames({ page = 1, limit = 20, type, featured }) {
    const cacheKey = `games:${page}:${limit}:${type || 'all'}:${featured || 'all'}`;
    let result = await cacheGet(cacheKey);

    if (!result) {
      const where = { isActive: true };

      if (type) {
        where.type = type;
      }

      if (featured !== undefined) {
        where.isFeatured = featured === 'true' || featured === true;
      }

      const offset = (page - 1) * limit;

      const { count, rows } = await Game.findAndCountAll({
        where,
        limit: parseInt(limit),
        offset,
        order: [
          ['isFeatured', 'DESC'],
          ['name', 'ASC'],
        ],
      });

      result = {
        games: rows,
        pagination: {
          total: count,
          page: parseInt(page),
          limit: parseInt(limit),
          totalPages: Math.ceil(count / limit),
        },
      };

      await cacheSet(cacheKey, result, 60); // Cache for 1 minute
    }

    return result;
  }

  async getGameById(gameId) {
    const cacheKey = `game:${gameId}`;
    let game = await cacheGet(cacheKey);

    if (!game) {
      game = await Game.findByPk(gameId);

      if (!game) {
        throw new Error('Game not found');
      }

      await cacheSet(cacheKey, game, 300); // Cache for 5 minutes
    }

    return game;
  }

  async getGameBySlug(slug) {
    const cacheKey = `game:slug:${slug}`;
    let game = await cacheGet(cacheKey);

    if (!game) {
      game = await Game.findOne({ where: { slug, isActive: true } });

      if (!game) {
        throw new Error('Game not found');
      }

      await cacheSet(cacheKey, game, 300);
    }

    return game;
  }

  async getFeaturedGames() {
    const cacheKey = 'games:featured';
    let games = await cacheGet(cacheKey);

    if (!games) {
      games = await Game.findAll({
        where: { isActive: true, isFeatured: true },
        order: [['name', 'ASC']],
      });

      await cacheSet(cacheKey, games, 60);
    }

    return games;
  }

  async getGameTypes() {
    const cacheKey = 'games:types';
    let types = await cacheGet(cacheKey);

    if (!types) {
      const games = await Game.findAll({
        where: { isActive: true },
        attributes: ['type'],
        group: ['type'],
      });

      types = games.map((g) => g.type);
      await cacheSet(cacheKey, types, 300);
    }

    return types;
  }

  async getBetHistory(userId, { page = 1, limit = 20, gameId, status }) {
    const where = { userId };

    if (gameId) {
      where.gameId = gameId;
    }

    if (status) {
      where.status = status;
    }

    const offset = (page - 1) * limit;

    const { count, rows } = await Bet.findAndCountAll({
      where,
      include: [
        {
          model: Game,
          as: 'game',
          attributes: ['id', 'name', 'slug', 'type', 'thumbnailUrl'],
        },
      ],
      limit: parseInt(limit),
      offset,
      order: [['placedAt', 'DESC']],
    });

    return {
      bets: rows,
      pagination: {
        total: count,
        page: parseInt(page),
        limit: parseInt(limit),
        totalPages: Math.ceil(count / limit),
      },
    };
  }

  async getBetById(betId, userId) {
    const bet = await Bet.findOne({
      where: { id: betId, userId },
      include: [
        {
          model: Game,
          as: 'game',
          attributes: ['id', 'name', 'slug', 'type'],
        },
      ],
    });

    if (!bet) {
      throw new Error('Bet not found');
    }

    return bet;
  }

  async getRecentBets(limit = 20) {
    const cacheKey = `bets:recent:${limit}`;
    let bets = await cacheGet(cacheKey);

    if (!bets) {
      bets = await Bet.findAll({
        include: [
          {
            model: User,
            as: 'user',
            attributes: ['id', 'username', 'avatarUrl'],
          },
          {
            model: Game,
            as: 'game',
            attributes: ['id', 'name', 'slug', 'type'],
          },
        ],
        where: { status: ['won', 'lost'] },
        order: [['resolvedAt', 'DESC']],
        limit: parseInt(limit),
      });

      await cacheSet(cacheKey, bets, 5); // Cache for 5 seconds
    }

    return bets;
  }

  async getBigWins(limit = 10) {
    const cacheKey = `bets:bigwins:${limit}`;
    let bets = await cacheGet(cacheKey);

    if (!bets) {
      bets = await Bet.findAll({
        include: [
          {
            model: User,
            as: 'user',
            attributes: ['id', 'username', 'avatarUrl'],
          },
          {
            model: Game,
            as: 'game',
            attributes: ['id', 'name', 'slug', 'type'],
          },
        ],
        where: { status: 'won' },
        order: [['actualWin', 'DESC']],
        limit: parseInt(limit),
      });

      await cacheSet(cacheKey, bets, 30); // Cache for 30 seconds
    }

    return bets;
  }
}

module.exports = new GameService();
