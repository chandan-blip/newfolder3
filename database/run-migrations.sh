#!/bin/bash

# Database Migration Runner
# Usage: ./run-migrations.sh [host] [port] [database] [user] [password]

HOST=${1:-localhost}
PORT=${2:-3306}
DATABASE=${3:-casino_db}
USER=${4:-casino_user}
PASSWORD=${5:-casino_password}

MIGRATIONS_DIR="$(dirname "$0")/migrations"

echo "Running migrations on $DATABASE@$HOST:$PORT"

# Run each migration file in order
for file in $(ls "$MIGRATIONS_DIR"/*.sql | sort); do
    filename=$(basename "$file")

    # Check if migration was already executed
    result=$(mysql -h "$HOST" -P "$PORT" -u "$USER" -p"$PASSWORD" "$DATABASE" -N -e \
        "SELECT COUNT(*) FROM migrations WHERE name = '$filename';" 2>/dev/null)

    if [ "$result" == "0" ] || [ -z "$result" ]; then
        echo "Running migration: $filename"

        if mysql -h "$HOST" -P "$PORT" -u "$USER" -p"$PASSWORD" "$DATABASE" < "$file"; then
            # Record migration (skip for the migrations table itself)
            if [ "$filename" != "000_create_migrations_table.sql" ]; then
                mysql -h "$HOST" -P "$PORT" -u "$USER" -p"$PASSWORD" "$DATABASE" -e \
                    "INSERT INTO migrations (name) VALUES ('$filename');"
            fi
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
