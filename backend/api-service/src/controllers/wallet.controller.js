const axios = require('axios');
const { Wallet, Transaction } = require('../models');
const { asyncHandler, AppError } = require('../middleware/errorHandler');

const WALLET_SERVICE_URL = process.env.WALLET_SERVICE_URL || 'http://wallet-service:3003';

exports.getBalance = asyncHandler(async (req, res) => {
  const wallet = await Wallet.findOne({
    where: { userId: req.user.id },
  });

  if (!wallet) {
    throw new AppError('Wallet not found', 404, 'WALLET_NOT_FOUND');
  }

  res.json({
    success: true,
    data: {
      balance: wallet.balance,
      currency: wallet.currency,
      lockedBalance: wallet.lockedBalance,
    },
  });
});

exports.deposit = asyncHandler(async (req, res) => {
  const { amount, idempotencyKey } = req.body;

  try {
    // Call wallet service for ACID transaction
    const response = await axios.post(`${WALLET_SERVICE_URL}/internal/deposit`, {
      userId: req.user.id,
      amount,
      idempotencyKey,
    });

    res.json({
      success: true,
      message: 'Deposit successful',
      data: response.data,
    });
  } catch (error) {
    console.error('Wallet service error:', error.message);
    if (error.response) {
      throw new AppError(
        error.response.data?.error || 'Deposit failed',
        error.response.status,
        'DEPOSIT_FAILED'
      );
    }
    throw new AppError('Wallet service unavailable', 503, 'SERVICE_UNAVAILABLE');
  }
});

exports.withdraw = asyncHandler(async (req, res) => {
  const { amount, idempotencyKey } = req.body;

  try {
    // Call wallet service for ACID transaction
    const response = await axios.post(`${WALLET_SERVICE_URL}/internal/withdraw`, {
      userId: req.user.id,
      amount,
      idempotencyKey,
    });

    res.json({
      success: true,
      message: 'Withdrawal successful',
      data: response.data,
    });
  } catch (error) {
    console.error('Wallet service error:', error.message);
    if (error.response) {
      throw new AppError(
        error.response.data?.error || 'Withdrawal failed',
        error.response.status,
        'WITHDRAWAL_FAILED'
      );
    }
    throw new AppError('Wallet service unavailable', 503, 'SERVICE_UNAVAILABLE');
  }
});

exports.getTransactions = asyncHandler(async (req, res) => {
  const { page = 1, limit = 20, type } = req.query;

  const wallet = await Wallet.findOne({
    where: { userId: req.user.id },
  });

  if (!wallet) {
    throw new AppError('Wallet not found', 404, 'WALLET_NOT_FOUND');
  }

  const where = { walletId: wallet.id };

  if (type) {
    where.type = type;
  }

  const offset = (parseInt(page) - 1) * parseInt(limit);

  const { count, rows } = await Transaction.findAndCountAll({
    where,
    limit: parseInt(limit),
    offset,
    order: [['created_at', 'DESC']],
  });

  res.json({
    success: true,
    data: {
      transactions: rows,
      pagination: {
        total: count,
        page: parseInt(page),
        limit: parseInt(limit),
        totalPages: Math.ceil(count / parseInt(limit)),
      },
    },
  });
});

exports.getTransaction = asyncHandler(async (req, res) => {
  const { id } = req.params;

  const wallet = await Wallet.findOne({
    where: { userId: req.user.id },
  });

  if (!wallet) {
    throw new AppError('Wallet not found', 404, 'WALLET_NOT_FOUND');
  }

  const transaction = await Transaction.findOne({
    where: { id, walletId: wallet.id },
  });

  if (!transaction) {
    throw new AppError('Transaction not found', 404, 'TRANSACTION_NOT_FOUND');
  }

  res.json({
    success: true,
    data: { transaction },
  });
});
