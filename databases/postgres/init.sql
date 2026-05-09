-- Runtime Metrics Database Initialization
-- This script runs automatically when the database is created

CREATE TABLE IF NOT EXISTS metrics (
    id SERIAL PRIMARY KEY,
    source VARCHAR(50) NOT NULL,
    cpu_id INTEGER NOT NULL,
    cpu_usage DOUBLE PRECISION NOT NULL,
    node_id INTEGER,
    memory_mb DOUBLE PRECISION,
    local_latency DOUBLE PRECISION,
    remote_latency DOUBLE PRECISION,
    timestamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_metrics_source ON metrics (source);
CREATE INDEX IF NOT EXISTS idx_metrics_timestamp ON metrics (timestamp DESC);
