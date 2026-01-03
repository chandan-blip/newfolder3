#!/bin/bash

# Wait for MySQL to be ready
until mysql -u root -p"$MYSQL_ROOT_PASSWORD" -e "SELECT 1" &>/dev/null; do
    echo "Waiting for MySQL to be ready..."
    sleep 2
done

echo "MySQL is ready. Running migrations..."

DATABASE="${MYSQL_DATABASE:-casino_db}"

# Create migrations table if not exists
mysql -u root -p"$MYSQL_ROOT_PASSWORD" "$DATABASE" <<EOF
CREATE TABLE IF NOT EXISTS migrations (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255) NOT NULL UNIQUE,
    executed_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    INDEX idx_name (name)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
EOF

# Run each migration in order
for file in $(ls /migrations/*.sql | sort); do
    filename=$(basename "$file")

    # Skip migrations table creation
    if [ "$filename" == "000_create_migrations_table.sql" ]; then
        continue
    fi

    # Check if already executed
    count=$(mysql -u root -p"$MYSQL_ROOT_PASSWORD" "$DATABASE" -N -e \
        "SELECT COUNT(*) FROM migrations WHERE name = '$filename';" 2>/dev/null)

    if [ "$count" == "0" ]; then
        echo "Running: $filename"
        if mysql -u root -p"$MYSQL_ROOT_PASSWORD" "$DATABASE" < "$file"; then
            mysql -u root -p"$MYSQL_ROOT_PASSWORD" "$DATABASE" -e \
                "INSERT INTO migrations (name) VALUES ('$filename');"
            echo "  ✓ $filename completed"
        else
            echo "  ✗ $filename failed"
            exit 1
        fi
    else
        echo "  - $filename (already executed)"
    fi
done

echo "All migrations completed!"
