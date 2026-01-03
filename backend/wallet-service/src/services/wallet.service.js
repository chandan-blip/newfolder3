const { v4: uuidv4 } = require('uuid');
const { sequelize } = require('../config/database');
const { redisClient } = require('../config/redis');
const { QueryTypes } = require('sequelize');

class WalletService {
  // Atomic deposit with idempotency
  async deposit(userId, amount, idempotencyKey) {
    // Check idempotency
    if (idempotencyKey) {
      const existing = await this.checkIdempotency(idempotencyKey);
      if (existing) {
        return existing;
      }
    }

    const transaction = await sequelize.transaction({
      isolationLevel: 'SERIALIZABLE',
    });

    try {
      // Lock wallet row
      const [wallet] = await sequelize.query(
        'SELECT * FROM wallets WHERE user_id = ? FOR UPDATE',
        {
          replacements: [userId],
          type: QueryTypes.SELECT,
          transaction,
        }
      );

      if (!wallet) {
        throw new Error('Wallet not found');
      }

      const balanceBefore = parseFloat(wallet.balance);
      const balanceAfter = balanceBefore + parseFloat(amount);
      const newVersion = wallet.version + 1;

      // Update balance
      await sequelize.query(
        'UPDATE wallets SET balance = ?, version = ?, updated_at = NOW() WHERE id = ? AND version = ?',
        {
          replacements: [balanceAfter, newVersion, wallet.id, wallet.version],
          type: QueryTypes.UPDATE,
          transaction,
        }
      );

      // Create transaction record
      const transactionId = uuidv4();
      await sequelize.query(
        `INSERT INTO transactions
         (id, wallet_id, user_id, type, amount, balance_before, balance_after, status, idempotency_key, created_at)
         VALUES (?, ?, ?, 'deposit', ?, ?, ?, 'completed', ?, NOW())`,
        {
          replacements: [transactionId, wallet.id, userId, amount, balanceBefore, balanceAfter, idempotencyKey || null],
          type: QueryTypes.INSERT,
          transaction,
        }
      );

      await transaction.commit();

      // Clear cache
      await redisClient.del(`user:${userId}`);

      const result = {
        success: true,
        transactionId,
        balance: balanceAfter,
        amount,
      };

      // Store for idempotency
      if (idempotencyKey) {
        await redisClient.setex(`idempotency:${idempotencyKey}`, 86400, JSON.stringify(result));
      }

      return result;
    } catch (error) {
      await transaction.rollback();
      throw error;
    }
  }

  // Atomic withdrawal with balance check
  async withdraw(userId, amount, idempotencyKey) {
    if (idempotencyKey) {
      const existing = await this.checkIdempotency(idempotencyKey);
      if (existing) {
        return existing;
      }
    }

    const transaction = await sequelize.transaction({
      isolationLevel: 'SERIALIZABLE',
    });

    try {
      const [wallet] = await sequelize.query(
        'SELECT * FROM wallets WHERE user_id = ? FOR UPDATE',
        {
          replacements: [userId],
          type: QueryTypes.SELECT,
          transaction,
        }
      );

      if (!wallet) {
        throw new Error('Wallet not found');
      }

      const balanceBefore = parseFloat(wallet.balance);

      if (balanceBefore < amount) {
        throw new Error('Insufficient balance');
      }

      const balanceAfter = balanceBefore - parseFloat(amount);
      const newVersion = wallet.version + 1;

      await sequelize.query(
        'UPDATE wallets SET balance = ?, version = ?, updated_at = NOW() WHERE id = ? AND version = ?',
        {
          replacements: [balanceAfter, newVersion, wallet.id, wallet.version],
          type: QueryTypes.UPDATE,
          transaction,
        }
      );

      const transactionId = uuidv4();
      await sequelize.query(
        `INSERT INTO transactions
         (id, wallet_id, user_id, type, amount, balance_before, balance_after, status, idempotency_key, created_at)
         VALUES (?, ?, ?, 'withdrawal', ?, ?, ?, 'completed', ?, NOW())`,
        {
          replacements: [transactionId, wallet.id, userId, -amount, balanceBefore, balanceAfter, idempotencyKey || null],
          type: QueryTypes.INSERT,
          transaction,
        }
      );

      await transaction.commit();

      await redisClient.del(`user:${userId}`);

      const result = {
        success: true,
        transactionId,
        balance: balanceAfter,
        amount,
      };

      if (idempotencyKey) {
        await redisClient.setex(`idempotency:${idempotencyKey}`, 86400, JSON.stringify(result));
      }

      return result;
    } catch (error) {
      await transaction.rollback();
      throw error;
    }
  }

  // Atomic bet placement (debit)
  async placeBet(userId, amount, gameId, idempotencyKey) {
    if (idempotencyKey) {
      const existing = await this.checkIdempotency(idempotencyKey);
      if (existing) {
        return existing;
      }
    }

    const transaction = await sequelize.transaction({
      isolationLevel: 'SERIALIZABLE',
    });

    try {
      const [wallet] = await sequelize.query(
        'SELECT * FROM wallets WHERE user_id = ? FOR UPDATE',
        {
          replacements: [userId],
          type: QueryTypes.SELECT,
          transaction,
        }
      );

      if (!wallet) {
        throw new Error('Wallet not found');
      }

      const balanceBefore = parseFloat(wallet.balance);

      if (balanceBefore < amount) {
        throw new Error('Insufficient balance');
      }

      const balanceAfter = balanceBefore - parseFloat(amount);
      const newVersion = wallet.version + 1;

      await sequelize.query(
        'UPDATE wallets SET balance = ?, version = ?, updated_at = NOW() WHERE id = ? AND version = ?',
        {
          replacements: [balanceAfter, newVersion, wallet.id, wallet.version],
          type: QueryTypes.UPDATE,
          transaction,
        }
      );

      const transactionId = uuidv4();
      await sequelize.query(
        `INSERT INTO transactions
         (id, wallet_id, user_id, type, amount, balance_before, balance_after, reference_type, status, idempotency_key, created_at)
         VALUES (?, ?, ?, 'bet', ?, ?, ?, 'game', 'completed', ?, NOW())`,
        {
          replacements: [transactionId, wallet.id, userId, -amount, balanceBefore, balanceAfter, idempotencyKey || null],
          type: QueryTypes.INSERT,
          transaction,
        }
      );

      await transaction.commit();

      await redisClient.del(`user:${userId}`);

      const result = {
        success: true,
        transactionId,
        balance: balanceAfter,
        amount,
      };

      if (idempotencyKey) {
        await redisClient.setex(`idempotency:${idempotencyKey}`, 86400, JSON.stringify(result));
      }

      return result;
    } catch (error) {
      await transaction.rollback();
      throw error;
    }
  }

  // Atomic win credit
  async creditWin(userId, amount, referenceId, gameId, idempotencyKey) {
    if (idempotencyKey) {
      const existing = await this.checkIdempotency(idempotencyKey);
      if (existing) {
        return existing;
      }
    }

    const transaction = await sequelize.transaction({
      isolationLevel: 'SERIALIZABLE',
    });

    try {
      const [wallet] = await sequelize.query(
        'SELECT * FROM wallets WHERE user_id = ? FOR UPDATE',
        {
          replacements: [userId],
          type: QueryTypes.SELECT,
          transaction,
        }
      );

      if (!wallet) {
        throw new Error('Wallet not found');
      }

      const balanceBefore = parseFloat(wallet.balance);
      const balanceAfter = balanceBefore + parseFloat(amount);
      const newVersion = wallet.version + 1;

      await sequelize.query(
        'UPDATE wallets SET balance = ?, version = ?, updated_at = NOW() WHERE id = ? AND version = ?',
        {
          replacements: [balanceAfter, newVersion, wallet.id, wallet.version],
          type: QueryTypes.UPDATE,
          transaction,
        }
      );

      const transactionId = uuidv4();
      await sequelize.query(
        `INSERT INTO transactions
         (id, wallet_id, user_id, type, amount, balance_before, balance_after, reference_id, reference_type, status, idempotency_key, created_at)
         VALUES (?, ?, ?, 'win', ?, ?, ?, ?, 'bet', 'completed', ?, NOW())`,
        {
          replacements: [transactionId, wallet.id, userId, amount, balanceBefore, balanceAfter, referenceId || null, idempotencyKey || null],
          type: QueryTypes.INSERT,
          transaction,
        }
      );

      await transaction.commit();

      await redisClient.del(`user:${userId}`);

      const result = {
        success: true,
        transactionId,
        balance: balanceAfter,
        amount,
      };

      if (idempotencyKey) {
        await redisClient.setex(`idempotency:${idempotencyKey}`, 86400, JSON.stringify(result));
      }

      return result;
    } catch (error) {
      await transaction.rollback();
      throw error;
    }
  }

  // Refund transaction
  async refund(userId, amount, referenceId, reason, idempotencyKey) {
    if (idempotencyKey) {
      const existing = await this.checkIdempotency(idempotencyKey);
      if (existing) {
        return existing;
      }
    }

    const transaction = await sequelize.transaction({
      isolationLevel: 'SERIALIZABLE',
    });

    try {
      const [wallet] = await sequelize.query(
        'SELECT * FROM wallets WHERE user_id = ? FOR UPDATE',
        {
          replacements: [userId],
          type: QueryTypes.SELECT,
          transaction,
        }
      );

      if (!wallet) {
        throw new Error('Wallet not found');
      }

      const balanceBefore = parseFloat(wallet.balance);
      const balanceAfter = balanceBefore + parseFloat(amount);
      const newVersion = wallet.version + 1;

      await sequelize.query(
        'UPDATE wallets SET balance = ?, version = ?, updated_at = NOW() WHERE id = ? AND version = ?',
        {
          replacements: [balanceAfter, newVersion, wallet.id, wallet.version],
          type: QueryTypes.UPDATE,
          transaction,
        }
      );

      const transactionId = uuidv4();
      await sequelize.query(
        `INSERT INTO transactions
         (id, wallet_id, user_id, type, amount, balance_before, balance_after, reference_id, reference_type, description, status, idempotency_key, created_at)
         VALUES (?, ?, ?, 'refund', ?, ?, ?, ?, 'bet', ?, 'completed', ?, NOW())`,
        {
          replacements: [transactionId, wallet.id, userId, amount, balanceBefore, balanceAfter, referenceId || null, reason || null, idempotencyKey || null],
          type: QueryTypes.INSERT,
          transaction,
        }
      );

      await transaction.commit();

      await redisClient.del(`user:${userId}`);

      return {
        success: true,
        transactionId,
        balance: balanceAfter,
        amount,
      };
    } catch (error) {
      await transaction.rollback();
      throw error;
    }
  }

  // Get wallet balance
  async getBalance(userId) {
    const [wallet] = await sequelize.query(
      'SELECT balance, currency, locked_balance FROM wallets WHERE user_id = ?',
      {
        replacements: [userId],
        type: QueryTypes.SELECT,
      }
    );

    if (!wallet) {
      throw new Error('Wallet not found');
    }

    return {
      balance: parseFloat(wallet.balance),
      currency: wallet.currency,
      lockedBalance: parseFloat(wallet.locked_balance),
    };
  }

  // Check idempotency key
  async checkIdempotency(key) {
    const cached = await redisClient.get(`idempotency:${key}`);
    if (cached) {
      return JSON.parse(cached);
    }

    const [existing] = await sequelize.query(
      'SELECT id FROM transactions WHERE idempotency_key = ?',
      {
        replacements: [key],
        type: QueryTypes.SELECT,
      }
    );

    return existing ? { success: true, duplicate: true } : null;
  }
}

module.exports = new WalletService();
