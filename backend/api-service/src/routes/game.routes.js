const express = require('express');
const router = express.Router();
const gameController = require('../controllers/game.controller');
const { authenticate, optionalAuth } = require('../middleware/auth');
const validate = require('../middleware/validate');
const {
  gameIdValidation,
  gameSlugValidation,
  gameListValidation,
  betHistoryValidation,
} = require('../validators/game.validators');

// Public routes
router.get(
  '/',
  validate(gameListValidation),
  gameController.getGames
);

router.get('/featured', gameController.getFeaturedGames);

router.get('/types', gameController.getGameTypes);

router.get('/recent-bets', gameController.getRecentBets);

router.get('/big-wins', gameController.getBigWins);

router.get(
  '/by-slug/:slug',
  validate(gameSlugValidation),
  gameController.getGameBySlug
);

router.get(
  '/:id',
  validate(gameIdValidation),
  gameController.getGameById
);

// Protected routes
router.get(
  '/user/bets',
  authenticate,
  validate(betHistoryValidation),
  gameController.getBetHistory
);

router.get(
  '/user/bets/:id',
  authenticate,
  gameController.getBetById
);

// Internal endpoint for game engine to save bet records
router.post('/internal/save-bet', gameController.saveBet);

module.exports = router;
