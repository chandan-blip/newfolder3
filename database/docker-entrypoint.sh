#!/bin/bash
set -e

# Run migrations in background after MySQL starts
(
    # Wait for MySQL to start
    sleep 10
    /migrate.sh
) &

# Call original MySQL entrypoint
exec docker-entrypoint.sh "$@"
