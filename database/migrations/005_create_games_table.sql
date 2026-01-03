-- Migration: 005_create_games_table
-- Description: Create games table
-- Created: 2026-01-03

CREATE TABLE IF NOT EXISTS games (
    id CHAR(36) PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    slug VARCHAR(100) NOT NULL UNIQUE,
    type ENUM('slots', 'roulette', 'blackjack', 'dice', 'crash', 'poker', 'baccarat') NOT NULL,
    description TEXT,
    thumbnail_url VARCHAR(500),
    min_bet DECIMAL(18, 8) NOT NULL DEFAULT 0.10000000,
    max_bet DECIMAL(18, 8) NOT NULL DEFAULT 10000.00000000,
    house_edge DECIMAL(5, 4) NOT NULL DEFAULT 0.0200,
    rtp DECIMAL(5, 4) NOT NULL DEFAULT 0.9800,
    is_active BOOLEAN DEFAULT TRUE,
    is_featured BOOLEAN DEFAULT FALSE,
    config JSON,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    INDEX idx_slug (slug),
    INDEX idx_type (type),
    INDEX idx_active (is_active),
    INDEX idx_featured (is_featured)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
