-- Migration: 011_create_stored_procedures
-- Description: Create stored procedures for atomic operations
-- Created: 2026-01-03

DELIMITER //

-- Procedure for atomic wallet balance update with optimistic locking
CREATE PROCEDURE IF NOT EXISTS update_wallet_balance(
    IN p_wallet_id CHAR(36),
    IN p_amount DECIMAL(18, 8),
    IN p_expected_version INT,
    OUT p_success BOOLEAN,
    OUT p_new_balance DECIMAL(18, 8),
    OUT p_new_version INT
)
BEGIN
    DECLARE current_balance DECIMAL(18, 8);
    DECLARE current_version INT;

    START TRANSACTION;

    -- Lock the row and get current values
    SELECT balance, version INTO current_balance, current_version
    FROM wallets
    WHERE id = p_wallet_id
    FOR UPDATE;

    -- Check version for optimistic locking
    IF current_version != p_expected_version THEN
        SET p_success = FALSE;
        SET p_new_balance = current_balance;
        SET p_new_version = current_version;
        ROLLBACK;
    ELSEIF current_balance + p_amount < 0 THEN
        -- Prevent negative balance
        SET p_success = FALSE;
        SET p_new_balance = current_balance;
        SET p_new_version = current_version;
        ROLLBACK;
    ELSE
        -- Update balance
        UPDATE wallets
        SET balance = balance + p_amount,
            version = version + 1,
            updated_at = CURRENT_TIMESTAMP
        WHERE id = p_wallet_id;

        SET p_success = TRUE;
        SET p_new_balance = current_balance + p_amount;
        SET p_new_version = current_version + 1;
        COMMIT;
    END IF;
END //

DELIMITER ;
