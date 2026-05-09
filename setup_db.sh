#!/bin/bash

echo "Starting PostgreSQL Setup..."

sudo apt update
sudo DEBIAN_FRONTEND=noninteractive apt install -y postgresql postgresql-contrib

sudo service postgresql start
sleep 2

echo "Creating database 'runtime_metrics'..."
sudo -u postgres psql -c "CREATE DATABASE runtime_metrics;"

echo "Creating 'metrics' table and setting password for 'postgres' user..."
sudo -u postgres psql -d runtime_metrics -c "
CREATE TABLE IF NOT EXISTS metrics (
    id SERIAL PRIMARY KEY,
    source VARCHAR(50),
    cpu_id INTEGER,
    cpu_usage DOUBLE PRECISION,
    node_id INTEGER,
    memory_mb DOUBLE PRECISION,
    local_latency DOUBLE PRECISION,
    remote_latency DOUBLE PRECISION,
    timestamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
"

sudo -u postgres psql -c "ALTER USER postgres PASSWORD 'your_password';"

echo "Database setup complete!"
echo "You can now run the gateway and agents."
