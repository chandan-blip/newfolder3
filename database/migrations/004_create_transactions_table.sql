-- Migration: 004_create_transactions_table
-- Description: Create transactions table (immutable ledger)
-- Created: 2026-01-03

CREATE TABLE IF NOT EXISTS transactions (
    id CHAR(36) PRIMARY KEY,
    wallet_id CHAR(36) NOT NULL,
    user_id CHAR(36) NOT NULL,
    type ENUM('deposit', 'withdrawal', 'bet', 'win', 'refund', 'bonus', 'adjustment') NOT NULL,
    amount DECIMAL(18, 8) NOT NULL,
    balance_before DECIMAL(18, 8) NOT NULL,
    balance_after DECIMAL(18, 8) NOT NULL,
    reference_id CHAR(36),
    reference_type VARCHAR(50),
    description VARCHAR(500),
    status ENUM('pending', 'completed', 'failed', 'cancelled') DEFAULT 'completed',
    idempotency_key VARCHAR(100) UNIQUE,
    metadata JSON,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (wallet_id) REFERENCES wallets(id),
    FOREIGN KEY (user_id) REFERENCES users(id),
    INDEX idx_wallet_id (wallet_id),
    INDEX idx_user_id (user_id),
    INDEX idx_type (type),
    INDEX idx_reference (reference_id, reference_type),
    INDEX idx_created_at (created_at),
    INDEX idx_idempotency (idempotency_key)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
