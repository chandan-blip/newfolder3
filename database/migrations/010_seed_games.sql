-- Migration: 010_seed_games
-- Description: Insert default games data
-- Created: 2026-01-03

INSERT INTO games (id, name, slug, type, description, min_bet, max_bet, house_edge, rtp, is_active, is_featured, config) VALUES
(UUID(), 'Classic Dice', 'classic-dice', 'dice', 'Roll the dice and predict the outcome. Simple and exciting!', 0.10, 1000.00, 0.0100, 0.9900, TRUE, TRUE, '{"minRoll": 0, "maxRoll": 100, "defaultTarget": 50}'),
(UUID(), 'Crash', 'crash', 'crash', 'Watch the multiplier rise and cash out before it crashes!', 0.10, 500.00, 0.0300, 0.9700, TRUE, TRUE, '{"maxMultiplier": 1000, "tickInterval": 100}'),
(UUID(), 'European Roulette', 'european-roulette', 'roulette', 'Classic European roulette with a single zero.', 1.00, 5000.00, 0.0270, 0.9730, TRUE, TRUE, '{"type": "european", "numbers": 37}'),
(UUID(), 'Blackjack', 'blackjack', 'blackjack', 'Beat the dealer to 21 without going bust.', 5.00, 2000.00, 0.0050, 0.9950, TRUE, FALSE, '{"decks": 6, "dealerStandsOn": 17}'),
(UUID(), 'Lucky Slots', 'lucky-slots', 'slots', 'Spin the reels and match symbols to win big!', 0.20, 100.00, 0.0400, 0.9600, TRUE, TRUE, '{"reels": 5, "rows": 3, "paylines": 20}'),
(UUID(), 'Baccarat', 'baccarat', 'baccarat', 'Bet on Player, Banker, or Tie in this classic card game.', 10.00, 10000.00, 0.0106, 0.9894, TRUE, FALSE, '{"decks": 8}');
