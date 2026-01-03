const { body, param, query } = require('express-validator');

const gameIdValidation = [
  param('id')
    .isUUID()
    .withMessage('Invalid game ID'),
];

const gameSlugValidation = [
  param('slug')
    .isString()
    .isLength({ min: 1, max: 100 })
    .withMessage('Invalid game slug'),
];

const gameListValidation = [
  query('page')
    .optional()
    .isInt({ min: 1 })
    .withMessage('Page must be a positive integer'),
  query('limit')
    .optional()
    .isInt({ min: 1, max: 50 })
    .withMessage('Limit must be between 1 and 50'),
  query('type')
    .optional()
    .isIn(['slots', 'roulette', 'blackjack', 'dice', 'crash', 'poker', 'baccarat'])
    .withMessage('Invalid game type'),
  query('featured')
    .optional()
    .isBoolean()
    .withMessage('Featured must be a boolean'),
];

const placeBetValidation = [
  body('gameId')
    .isUUID()
    .withMessage('Invalid game ID'),
  body('amount')
    .isFloat({ min: 0.01 })
    .withMessage('Amount must be greater than 0'),
  body('betData')
    .optional()
    .isObject()
    .withMessage('Bet data must be an object'),
];

const betHistoryValidation = [
  query('page')
    .optional()
    .isInt({ min: 1 })
    .withMessage('Page must be a positive integer'),
  query('limit')
    .optional()
    .isInt({ min: 1, max: 100 })
    .withMessage('Limit must be between 1 and 100'),
  query('gameId')
    .optional()
    .isUUID()
    .withMessage('Invalid game ID'),
  query('status')
    .optional()
    .isIn(['pending', 'active', 'won', 'lost', 'cancelled', 'refunded'])
    .withMessage('Invalid bet status'),
];

module.exports = {
  gameIdValidation,
  gameSlugValidation,
  gameListValidation,
  placeBetValidation,
  betHistoryValidation,
};
