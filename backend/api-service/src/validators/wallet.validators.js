const { body, query } = require('express-validator');

const depositValidation = [
  body('amount')
    .isFloat({ min: 0.01, max: 100000 })
    .withMessage('Amount must be between 0.01 and 100,000'),
  body('idempotencyKey')
    .optional()
    .isString()
    .isLength({ max: 100 })
    .withMessage('Idempotency key must not exceed 100 characters'),
];

const withdrawValidation = [
  body('amount')
    .isFloat({ min: 0.01, max: 100000 })
    .withMessage('Amount must be between 0.01 and 100,000'),
  body('idempotencyKey')
    .optional()
    .isString()
    .isLength({ max: 100 })
    .withMessage('Idempotency key must not exceed 100 characters'),
];

const transactionHistoryValidation = [
  query('page')
    .optional()
    .isInt({ min: 1 })
    .withMessage('Page must be a positive integer'),
  query('limit')
    .optional()
    .isInt({ min: 1, max: 100 })
    .withMessage('Limit must be between 1 and 100'),
  query('type')
    .optional()
    .isIn(['deposit', 'withdrawal', 'bet', 'win', 'refund', 'bonus', 'adjustment'])
    .withMessage('Invalid transaction type'),
];

module.exports = {
  depositValidation,
  withdrawValidation,
  transactionHistoryValidation,
};
