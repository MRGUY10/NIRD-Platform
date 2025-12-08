#!/bin/bash

# NIRD Platform Backend Start Script for Render
# This script ensures the app binds to 0.0.0.0 and uses the PORT environment variable

# Get port from environment variable (Render sets this)
PORT=${PORT:-8000}

echo "🚀 Starting NIRD Platform Backend on 0.0.0.0:$PORT"

# Start the application with uvicorn
# --host 0.0.0.0 ensures it binds to all network interfaces (required by Render)
# --port $PORT uses Render's assigned port
# Note: We're already in the backend directory due to rootDir setting in render.yaml

exec uvicorn main:app \
    --host 0.0.0.0 \
    --port $PORT \
    --workers 2 \
    --log-level info
