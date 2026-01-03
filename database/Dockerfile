FROM mysql:8.0

# Copy migration files
COPY migrations/ /migrations/
COPY migrate.sh /migrate.sh

RUN chmod +x /migrate.sh

# Custom entrypoint that runs migrations after MySQL starts
COPY docker-entrypoint.sh /custom-entrypoint.sh
RUN chmod +x /custom-entrypoint.sh

ENTRYPOINT ["/custom-entrypoint.sh"]
CMD ["mysqld"]
