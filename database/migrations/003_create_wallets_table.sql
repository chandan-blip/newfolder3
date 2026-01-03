-- Migration: 003_create_wallets_table
-- Description: Create wallets table (one per user)
-- Created: 2026-01-03

CREATE TABLE IF NOT EXISTS wallets (
    id CHAR(36) PRIMARY KEY,
    user_id CHAR(36) NOT NULL UNIQUE,
    balance DECIMAL(18, 8) NOT NULL DEFAULT 0.00000000,
    currency VARCHAR(10) DEFAULT 'USD',
    locked_balance DECIMAL(18, 8) NOT NULL DEFAULT 0.00000000,
    version INT NOT NULL DEFAULT 1,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    INDEX idx_user_id (user_id),
    CONSTRAINT chk_balance_positive CHECK (balance >= 0),
    CONSTRAINT chk_locked_positive CHECK (locked_balance >= 0)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
