-- Migration: 010_seed_games
-- Description: Insert default games data
-- Created: 2026-01-03

INSERT INTO games (id, name, slug, type, description, min_bet, max_bet, house_edge, rtp, is_active, is_featured, config) VALUES
(UUID(), 'Classic Dice', 'classic-dice', 'dice', 'Roll the dice and predict the outcome. Simple and exciting!', 0.10, 1000.00, 0.0100, 0.9900, TRUE, TRUE, '{"minRoll": 0, "maxRoll": 100, "defaultTarget": 50}');
