const gameService = require('../services/game.service');
const { asyncHandler } = require('../middleware/errorHandler');

exports.getGames = asyncHandler(async (req, res) => {
  const { page, limit, type, featured } = req.query;

  const result = await gameService.getGames({ page, limit, type, featured });

  res.json({
    success: true,
    data: result,
  });
});

exports.getGameById = asyncHandler(async (req, res) => {
  const game = await gameService.getGameById(req.params.id);

  res.json({
    success: true,
    data: { game },
  });
});

exports.getGameBySlug = asyncHandler(async (req, res) => {
  const game = await gameService.getGameBySlug(req.params.slug);

  res.json({
    success: true,
    data: { game },
  });
});

exports.getFeaturedGames = asyncHandler(async (req, res) => {
  const games = await gameService.getFeaturedGames();

  res.json({
    success: true,
    data: { games },
  });
});

exports.getGameTypes = asyncHandler(async (req, res) => {
  const types = await gameService.getGameTypes();

  res.json({
    success: true,
    data: { types },
  });
});

exports.getBetHistory = asyncHandler(async (req, res) => {
  const { page, limit, gameId, status } = req.query;

  const result = await gameService.getBetHistory(req.user.id, {
    page,
    limit,
    gameId,
    status,
  });

  res.json({
    success: true,
    data: result,
  });
});

exports.getBetById = asyncHandler(async (req, res) => {
  const bet = await gameService.getBetById(req.params.id, req.user.id);

  res.json({
    success: true,
    data: { bet },
  });
});

exports.getRecentBets = asyncHandler(async (req, res) => {
  const { limit } = req.query;

  const bets = await gameService.getRecentBets(limit);

  res.json({
    success: true,
    data: { bets },
  });
});

exports.getBigWins = asyncHandler(async (req, res) => {
  const { limit } = req.query;

  const bets = await gameService.getBigWins(limit);

  res.json({
    success: true,
    data: { bets },
  });
});

// Internal endpoint for game engine to save bet records
exports.saveBet = asyncHandler(async (req, res) => {
  const betData = req.body;

  const bet = await gameService.saveBet(betData);

  res.json({
    success: true,
    data: { bet },
  });
});
