#!/bin/bash

echo "Starting PostgreSQL Setup..."

# Step 1: Install PostgreSQL
echo "Installing PostgreSQL..."
sudo apt update
sudo DEBIAN_FRONTEND=noninteractive apt install -y postgresql postgresql-contrib

# Start Service
echo "Starting PostgreSQL service..."
sudo service postgresql start

# Wait for service to start
sleep 2

# Step 2: Create Database
echo "Creating database 'runtime_metrics'..."
sudo -u postgres psql -c "CREATE DATABASE runtime_metrics;"

# Step 3: Create Table and Set Password
echo "Creating 'metrics' table and setting password for 'postgres' user..."
sudo -u postgres psql -d runtime_metrics -c "
CREATE TABLE IF NOT EXISTS metrics (
    id SERIAL PRIMARY KEY,
    source TEXT,
    cpu_id INT,
    cpu_usage FLOAT,
    timestamp BIGINT
);
"

# Set password for the postgres user so Node.js can connect
sudo -u postgres psql -c "ALTER USER postgres PASSWORD 'your_password';"

echo "Database setup complete! ✅"
echo "You can now run the gateway and agents."
