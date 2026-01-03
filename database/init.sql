-- Casino Database Initialization
-- This file runs all migrations in order

-- Set character set
SET NAMES utf8mb4;
SET FOREIGN_KEY_CHECKS = 1;

-- Create migrations tracking table
SOURCE /docker-entrypoint-initdb.d/migrations/000_create_migrations_table.sql;

-- Run all migrations
SOURCE /docker-entrypoint-initdb.d/migrations/001_create_users_table.sql;
SOURCE /docker-entrypoint-initdb.d/migrations/002_create_refresh_tokens_table.sql;
SOURCE /docker-entrypoint-initdb.d/migrations/003_create_wallets_table.sql;
SOURCE /docker-entrypoint-initdb.d/migrations/004_create_transactions_table.sql;
SOURCE /docker-entrypoint-initdb.d/migrations/005_create_games_table.sql;
SOURCE /docker-entrypoint-initdb.d/migrations/006_create_game_rounds_table.sql;
SOURCE /docker-entrypoint-initdb.d/migrations/007_create_bets_table.sql;
SOURCE /docker-entrypoint-initdb.d/migrations/008_create_audit_logs_table.sql;
SOURCE /docker-entrypoint-initdb.d/migrations/009_create_sessions_table.sql;
SOURCE /docker-entrypoint-initdb.d/migrations/010_seed_games.sql;
SOURCE /docker-entrypoint-initdb.d/migrations/011_create_stored_procedures.sql;
