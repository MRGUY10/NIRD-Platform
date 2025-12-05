#!/bin/bash

# Build script for Render
set -o errexit

echo "📦 Installing Python dependencies..."
cd backend
pip install --upgrade pip
pip install -r requirements.txt

echo "✅ Backend build complete!"
