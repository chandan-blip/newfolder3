-- Migration: 006_create_game_rounds_table
-- Description: Create game rounds table for provably fair gaming
-- Created: 2026-01-03

CREATE TABLE IF NOT EXISTS game_rounds (
    id CHAR(36) PRIMARY KEY,
    game_id CHAR(36) NOT NULL,
    server_seed_hash VARCHAR(64) NOT NULL,
    server_seed VARCHAR(64),
    client_seed VARCHAR(64),
    nonce BIGINT NOT NULL DEFAULT 0,
    status ENUM('active', 'completed', 'cancelled') DEFAULT 'active',
    result JSON,
    started_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    completed_at TIMESTAMP NULL,
    FOREIGN KEY (game_id) REFERENCES games(id),
    INDEX idx_game_id (game_id),
    INDEX idx_status (status),
    INDEX idx_started_at (started_at)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
