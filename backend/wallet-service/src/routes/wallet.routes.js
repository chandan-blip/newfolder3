const express = require('express');
const router = express.Router();
const walletService = require('../services/wallet.service');

// Deposit (for demo/testing - in production, this would go through payment gateway)
router.post('/deposit', async (req, res, next) => {
  try {
    const { userId, amount, idempotencyKey } = req.body;

    if (!userId || !amount) {
      return res.status(400).json({
        success: false,
        error: 'Missing required fields',
      });
    }

    if (amount <= 0) {
      return res.status(400).json({
        success: false,
        error: 'Amount must be positive',
      });
    }

    const result = await walletService.deposit(userId, amount, idempotencyKey);
    res.json(result);
  } catch (error) {
    next(error);
  }
});

// Withdrawal
router.post('/withdraw', async (req, res, next) => {
  try {
    const { userId, amount, idempotencyKey } = req.body;

    if (!userId || !amount) {
      return res.status(400).json({
        success: false,
        error: 'Missing required fields',
      });
    }

    if (amount <= 0) {
      return res.status(400).json({
        success: false,
        error: 'Amount must be positive',
      });
    }

    const result = await walletService.withdraw(userId, amount, idempotencyKey);
    res.json(result);
  } catch (error) {
    if (error.message === 'Insufficient balance') {
      return res.status(400).json({
        success: false,
        error: 'Insufficient balance',
      });
    }
    next(error);
  }
});

// Place bet (called by game engine)
router.post('/bet', async (req, res, next) => {
  try {
    const { userId, amount, gameId, idempotencyKey } = req.body;

    if (!userId || !amount || !gameId) {
      return res.status(400).json({
        success: false,
        error: 'Missing required fields',
      });
    }

    if (amount <= 0) {
      return res.status(400).json({
        success: false,
        error: 'Amount must be positive',
      });
    }

    const result = await walletService.placeBet(userId, amount, gameId, idempotencyKey);
    res.json(result);
  } catch (error) {
    if (error.message === 'Insufficient balance') {
      return res.status(400).json({
        success: false,
        error: 'Insufficient balance',
      });
    }
    next(error);
  }
});

// Credit win (called by game engine)
router.post('/win', async (req, res, next) => {
  try {
    const { userId, amount, referenceId, gameId, idempotencyKey } = req.body;

    if (!userId || !amount) {
      return res.status(400).json({
        success: false,
        error: 'Missing required fields',
      });
    }

    if (amount <= 0) {
      return res.status(400).json({
        success: false,
        error: 'Amount must be positive',
      });
    }

    const result = await walletService.creditWin(userId, amount, referenceId, gameId, idempotencyKey);
    res.json(result);
  } catch (error) {
    next(error);
  }
});

// Refund
router.post('/refund', async (req, res, next) => {
  try {
    const { userId, amount, referenceId, reason, idempotencyKey } = req.body;

    if (!userId || !amount) {
      return res.status(400).json({
        success: false,
        error: 'Missing required fields',
      });
    }

    const result = await walletService.refund(userId, amount, referenceId, reason, idempotencyKey);
    res.json(result);
  } catch (error) {
    next(error);
  }
});

// Get balance
router.get('/balance/:userId', async (req, res, next) => {
  try {
    const { userId } = req.params;
    const result = await walletService.getBalance(userId);
    res.json({ success: true, ...result });
  } catch (error) {
    if (error.message === 'Wallet not found') {
      return res.status(404).json({
        success: false,
        error: 'Wallet not found',
      });
    }
    next(error);
  }
});

module.exports = router;
