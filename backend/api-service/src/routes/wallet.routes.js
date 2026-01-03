const express = require('express');
const router = express.Router();
const walletController = require('../controllers/wallet.controller');
const { authenticate } = require('../middleware/auth');
const validate = require('../middleware/validate');
const { walletLimiter } = require('../middleware/rateLimiter');
const {
  depositValidation,
  withdrawValidation,
  transactionHistoryValidation,
} = require('../validators/wallet.validators');

// All routes require authentication
router.use(authenticate);
router.use(walletLimiter);

router.get('/balance', walletController.getBalance);

router.post(
  '/deposit',
  validate(depositValidation),
  walletController.deposit
);

router.post(
  '/withdraw',
  validate(withdrawValidation),
  walletController.withdraw
);

router.get(
  '/transactions',
  validate(transactionHistoryValidation),
  walletController.getTransactions
);

router.get('/transactions/:id', walletController.getTransaction);

module.exports = router;
