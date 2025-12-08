#!/bin/bash

# NIRD Platform Frontend Start Script for Render
# Serves the built static files on 0.0.0.0 with the PORT from environment

# Get port from environment variable (Render sets this)
PORT=${PORT:-3000}

echo "🚀 Starting NIRD Platform Frontend on 0.0.0.0:$PORT"

# Serve the built static files
# -s flag serves it as a Single Page Application (SPA)
# -l flag specifies the port and listens on all interfaces
# -c flag uses the serve.json configuration for routing and headers
exec npx serve -s dist -l tcp://0.0.0.0:$PORT -c serve.json
