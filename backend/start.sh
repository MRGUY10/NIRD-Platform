#!/bin/bash

# Apply database migrations
cd backend
alembic upgrade head

# Start the application
uvicorn main:app --host 0.0.0.0 --port ${PORT:-8000}
