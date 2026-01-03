const { User, Wallet, AuditLog } = require('../models');
const { cacheGet, cacheSet, cacheDel } = require('../config/redis');

class UserService {
  async getProfile(userId) {
    // Try cache first
    let user = await cacheGet(`user:${userId}`);

    if (!user) {
      const dbUser = await User.findByPk(userId, {
        include: [{ model: Wallet, as: 'wallet' }],
      });

      if (!dbUser) {
        throw new Error('User not found');
      }

      user = {
        ...dbUser.toSafeObject(),
        wallet: dbUser.wallet ? {
          id: dbUser.wallet.id,
          balance: dbUser.wallet.balance,
          currency: dbUser.wallet.currency,
        } : null,
      };

      await cacheSet(`user:${userId}`, user, 300);
    }

    return user;
  }

  async updateProfile(userId, updates, ipAddress, userAgent) {
    const user = await User.findByPk(userId);

    if (!user) {
      throw new Error('User not found');
    }

    const oldValues = {
      firstName: user.firstName,
      lastName: user.lastName,
      username: user.username,
    };

    // Check username uniqueness if updating
    if (updates.username && updates.username !== user.username) {
      const existingUser = await User.findOne({
        where: { username: updates.username },
      });

      if (existingUser) {
        throw new Error('Username already taken');
      }
    }

    await user.update(updates);

    // Audit log
    await AuditLog.create({
      userId,
      action: 'PROFILE_UPDATED',
      entityType: 'user',
      entityId: userId,
      oldValues,
      newValues: updates,
      ipAddress,
      userAgent,
    });

    // Clear cache
    await cacheDel(`user:${userId}`);

    return user.toSafeObject();
  }

  async getStats(userId) {
    const user = await User.findByPk(userId, {
      include: [{ model: Wallet, as: 'wallet' }],
    });

    if (!user) {
      throw new Error('User not found');
    }

    // Get betting stats from cache or compute
    const cacheKey = `stats:${userId}`;
    let stats = await cacheGet(cacheKey);

    if (!stats) {
      const { Bet } = require('../models');

      const [totalBets, wonBets, totalWagered, totalWon] = await Promise.all([
        Bet.count({ where: { userId } }),
        Bet.count({ where: { userId, status: 'won' } }),
        Bet.sum('amount', { where: { userId } }),
        Bet.sum('actualWin', { where: { userId, status: 'won' } }),
      ]);

      stats = {
        totalBets: totalBets || 0,
        wonBets: wonBets || 0,
        lostBets: (totalBets || 0) - (wonBets || 0),
        winRate: totalBets ? ((wonBets / totalBets) * 100).toFixed(2) : 0,
        totalWagered: totalWagered || 0,
        totalWon: totalWon || 0,
        netProfit: (totalWon || 0) - (totalWagered || 0),
      };

      await cacheSet(cacheKey, stats, 60); // Cache for 1 minute
    }

    return {
      user: user.toSafeObject(),
      wallet: user.wallet ? {
        balance: user.wallet.balance,
        currency: user.wallet.currency,
      } : null,
      stats,
    };
  }
}

module.exports = new UserService();
