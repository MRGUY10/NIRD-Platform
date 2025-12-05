-- Initial database setup script
-- This script runs automatically when the PostgreSQL container starts for the first time

-- Create extensions if needed
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Grant necessary permissions
GRANT ALL PRIVILEGES ON DATABASE nird_db TO nird_user;

-- Optional: Create initial schemas
-- CREATE SCHEMA IF NOT EXISTS nird;
