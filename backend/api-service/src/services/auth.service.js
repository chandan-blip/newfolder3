const jwt = require('jsonwebtoken');
const crypto = require('crypto');
const { v4: uuidv4 } = require('uuid');
const { User, RefreshToken, Wallet, AuditLog } = require('../models');
const { cacheSet, cacheDel } = require('../config/redis');
const { sequelize } = require('../config/database');

const JWT_SECRET = process.env.JWT_SECRET || 'your-super-secret-jwt-key';
const JWT_REFRESH_SECRET = process.env.JWT_REFRESH_SECRET || 'your-refresh-secret-key';
const ACCESS_TOKEN_EXPIRY = '15m';
const REFRESH_TOKEN_EXPIRY = '7d';
const REFRESH_TOKEN_EXPIRY_MS = 7 * 24 * 60 * 60 * 1000;

class AuthService {
  generateAccessToken(userId) {
    return jwt.sign({ userId }, JWT_SECRET, { expiresIn: ACCESS_TOKEN_EXPIRY });
  }

  generateRefreshToken() {
    return crypto.randomBytes(64).toString('hex');
  }

  hashToken(token) {
    return crypto.createHash('sha256').update(token).digest('hex');
  }

  async register({ email, username, password, firstName, lastName }, ipAddress, userAgent) {
    const transaction = await sequelize.transaction();

    try {
      // Check if user exists
      const existingUser = await User.findOne({
        where: { email },
        transaction,
      });

      if (existingUser) {
        throw new Error('Email already registered');
      }

      const existingUsername = await User.findOne({
        where: { username },
        transaction,
      });

      if (existingUsername) {
        throw new Error('Username already taken');
      }

      // Create user
      const user = await User.create({
        id: uuidv4(),
        email,
        username,
        passwordHash: password,
        firstName,
        lastName,
      }, { transaction });

      // Create wallet for user
      await Wallet.create({
        id: uuidv4(),
        userId: user.id,
        balance: 0,
        currency: 'USD',
      }, { transaction });

      // Generate tokens
      const accessToken = this.generateAccessToken(user.id);
      const refreshToken = this.generateRefreshToken();
      const refreshTokenHash = this.hashToken(refreshToken);

      // Store refresh token
      await RefreshToken.create({
        id: uuidv4(),
        userId: user.id,
        tokenHash: refreshTokenHash,
        expiresAt: new Date(Date.now() + REFRESH_TOKEN_EXPIRY_MS),
      }, { transaction });

      // Audit log
      await AuditLog.create({
        id: uuidv4(),
        userId: user.id,
        action: 'USER_REGISTERED',
        entityType: 'user',
        entityId: user.id,
        ipAddress,
        userAgent,
        newValues: { email, username },
      }, { transaction });

      await transaction.commit();

      return {
        user: user.toSafeObject(),
        accessToken,
        refreshToken,
      };
    } catch (error) {
      await transaction.rollback();
      throw error;
    }
  }

  async login({ email, password }, ipAddress, userAgent) {
    const user = await User.findOne({ where: { email } });

    if (!user) {
      throw new Error('Invalid credentials');
    }

    const isValidPassword = await user.verifyPassword(password);

    if (!isValidPassword) {
      // Log failed attempt
      await AuditLog.create({
        userId: user.id,
        action: 'LOGIN_FAILED',
        entityType: 'user',
        entityId: user.id,
        ipAddress,
        userAgent,
      });
      throw new Error('Invalid credentials');
    }

    if (user.status !== 'active') {
      throw new Error(`Account is ${user.status}`);
    }

    // Generate tokens
    const accessToken = this.generateAccessToken(user.id);
    const refreshToken = this.generateRefreshToken();
    const refreshTokenHash = this.hashToken(refreshToken);

    // Store refresh token
    await RefreshToken.create({
      id: uuidv4(),
      userId: user.id,
      tokenHash: refreshTokenHash,
      expiresAt: new Date(Date.now() + REFRESH_TOKEN_EXPIRY_MS),
    });

    // Update last login
    await user.update({
      lastLoginAt: new Date(),
      lastLoginIp: ipAddress,
    });

    // Audit log
    await AuditLog.create({
      userId: user.id,
      action: 'USER_LOGIN',
      entityType: 'user',
      entityId: user.id,
      ipAddress,
      userAgent,
    });

    // Cache user
    await cacheSet(`user:${user.id}`, user.toSafeObject(), 300);

    return {
      user: user.toSafeObject(),
      accessToken,
      refreshToken,
    };
  }

  async refreshAccessToken(refreshToken, ipAddress) {
    const tokenHash = this.hashToken(refreshToken);

    const storedToken = await RefreshToken.findOne({
      where: { tokenHash },
      include: [{ model: User, as: 'user' }],
    });

    if (!storedToken) {
      throw new Error('Invalid refresh token');
    }

    if (storedToken.revokedAt) {
      throw new Error('Refresh token has been revoked');
    }

    if (new Date() > storedToken.expiresAt) {
      throw new Error('Refresh token has expired');
    }

    if (storedToken.user.status !== 'active') {
      throw new Error(`Account is ${storedToken.user.status}`);
    }

    // Generate new access token
    const accessToken = this.generateAccessToken(storedToken.userId);

    // Optionally rotate refresh token
    const newRefreshToken = this.generateRefreshToken();
    const newRefreshTokenHash = this.hashToken(newRefreshToken);

    // Revoke old token and create new one
    await storedToken.update({ revokedAt: new Date() });

    await RefreshToken.create({
      id: uuidv4(),
      userId: storedToken.userId,
      tokenHash: newRefreshTokenHash,
      expiresAt: new Date(Date.now() + REFRESH_TOKEN_EXPIRY_MS),
    });

    return {
      accessToken,
      refreshToken: newRefreshToken,
    };
  }

  async logout(userId, accessToken, refreshToken) {
    // Blacklist access token
    const decoded = jwt.decode(accessToken);
    if (decoded && decoded.exp) {
      const ttl = decoded.exp - Math.floor(Date.now() / 1000);
      if (ttl > 0) {
        await cacheSet(`blacklist:${accessToken}`, true, ttl);
      }
    }

    // Revoke refresh token if provided
    if (refreshToken) {
      const tokenHash = this.hashToken(refreshToken);
      await RefreshToken.update(
        { revokedAt: new Date() },
        { where: { tokenHash } }
      );
    }

    // Clear user cache
    await cacheDel(`user:${userId}`);

    return true;
  }

  async logoutAll(userId) {
    // Revoke all refresh tokens
    await RefreshToken.update(
      { revokedAt: new Date() },
      { where: { userId, revokedAt: null } }
    );

    // Clear user cache
    await cacheDel(`user:${userId}`);

    return true;
  }

  async changePassword(userId, currentPassword, newPassword, ipAddress, userAgent) {
    const user = await User.findByPk(userId);

    if (!user) {
      throw new Error('User not found');
    }

    const isValidPassword = await user.verifyPassword(currentPassword);

    if (!isValidPassword) {
      await AuditLog.create({
        userId,
        action: 'PASSWORD_CHANGE_FAILED',
        entityType: 'user',
        entityId: userId,
        ipAddress,
        userAgent,
      });
      throw new Error('Current password is incorrect');
    }

    await user.update({ passwordHash: newPassword });

    // Revoke all refresh tokens
    await this.logoutAll(userId);

    await AuditLog.create({
      userId,
      action: 'PASSWORD_CHANGED',
      entityType: 'user',
      entityId: userId,
      ipAddress,
      userAgent,
    });

    return true;
  }
}

module.exports = new AuthService();
