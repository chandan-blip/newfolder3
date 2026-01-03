-- Migration: 007_create_bets_table
-- Description: Create bets table
-- Created: 2026-01-03

CREATE TABLE IF NOT EXISTS bets (
    id CHAR(36) PRIMARY KEY,
    user_id CHAR(36) NOT NULL,
    game_id CHAR(36) NOT NULL,
    round_id CHAR(36),
    transaction_id CHAR(36),
    win_transaction_id CHAR(36),
    amount DECIMAL(18, 8) NOT NULL,
    potential_win DECIMAL(18, 8),
    actual_win DECIMAL(18, 8) DEFAULT 0.00000000,
    multiplier DECIMAL(10, 4),
    bet_data JSON,
    result_data JSON,
    status ENUM('pending', 'active', 'won', 'lost', 'cancelled', 'refunded') DEFAULT 'pending',
    placed_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    resolved_at TIMESTAMP NULL,
    FOREIGN KEY (user_id) REFERENCES users(id),
    FOREIGN KEY (game_id) REFERENCES games(id),
    FOREIGN KEY (round_id) REFERENCES game_rounds(id),
    FOREIGN KEY (transaction_id) REFERENCES transactions(id),
    INDEX idx_user_id (user_id),
    INDEX idx_game_id (game_id),
    INDEX idx_round_id (round_id),
    INDEX idx_status (status),
    INDEX idx_placed_at (placed_at)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
