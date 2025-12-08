#!/bin/bash

# NIRD Platform Frontend Start Script for Render
# Serves the built static files on 0.0.0.0 with the PORT from environment

# Get port from environment variable (Render sets this)
if [ -z "$PORT" ]; then
  PORT=3000
fi

echo "🚀 Starting NIRD Platform Frontend on 0.0.0.0:$PORT"
echo "📍 Current directory: $(pwd)"
echo "📁 Checking dist directory..."
ls -la dist/ 2>/dev/null || echo "⚠️  dist directory not found!"

# Serve the built static files
# -s flag serves it as a Single Page Application (SPA)
# -l flag specifies the port and listens on all interfaces
# -c flag uses the serve.json configuration for routing and headers
echo "🔧 Starting serve with: npx serve -s dist -l tcp://0.0.0.0:$PORT"
exec npx serve -s dist -l tcp://0.0.0.0:$PORT
