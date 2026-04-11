-- Runtime Metrics Database Initialization
-- This script runs automatically when the database is created

CREATE TABLE IF NOT EXISTS metrics (
    id SERIAL PRIMARY KEY,
    source TEXT NOT NULL,
    cpu_id INT NOT NULL,
    cpu_usage FLOAT NOT NULL,
    timestamp BIGINT NOT NULL
);

-- Index for faster queries by source and time
CREATE INDEX IF NOT EXISTS idx_metrics_source ON metrics (source);
CREATE INDEX IF NOT EXISTS idx_metrics_timestamp ON metrics (timestamp DESC);
