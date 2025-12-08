# Render Deployment Guide

## Issue Fixed: Frontend Port Binding

The frontend application now properly binds to `0.0.0.0` and uses the `PORT` environment variable set by Render.

## Changes Made

### Frontend Files:

1. **`frontend/start.sh`** - Startup script that:
   - Reads the `PORT` environment variable from Render
   - Serves built static files on `0.0.0.0`
   - Uses `serve` package for production-ready static file serving

2. **`frontend/Procfile`** - Alternative simple deployment configuration

3. **`frontend/package.json`** - Added:
   - `serve` package dependency
   - `start` script for production

4. **`frontend/vite.config.ts`** - Updated:
   - Preview server to bind to `0.0.0.0`
   - Uses `PORT` environment variable

### Backend Files:

1. **`backend/start.sh`** - Created a startup script that:
   - Reads the `PORT` environment variable from Render
   - Binds to `0.0.0.0` (required for external access)
   - Starts uvicorn with proper configuration

2. **main.py** - Updated to:
   - Use `HOST` and `PORT` from environment variables
   - Added simple `/health` endpoint for Render health checks

3. **config.py** - Added:
   - `PORT` configuration field
   - `HOST` configuration field

4. **render.yaml** - Created Blueprint for easy deployment:
   - Configures web service
   - Sets environment variables
   - Links database connection

## Deployment Options

### Option 1: Using render.yaml (Recommended)

1. Commit all changes to your repository
2. Push to GitHub
3. In Render Dashboard:
   - Click "New" → "Blueprint"
   - Connect your repository
   - Render will automatically detect `render.yaml` and configure everything

### Option 2: Manual Web Service Setup - FRONTEND

If you already have a frontend web service configured in Render:

1. **Update Build Command:**
   ```
   npm install && npm run build
   ```

2. **Update Start Command:**
   ```
   bash start.sh
   ```
   
   Or use directly:
   ```
   npx serve -s dist -l tcp://0.0.0.0:$PORT
   ```

3. **Verify Environment Variables:**
   - `PORT` = (Auto-set by Render)
   - `VITE_API_URL` = Your backend API URL (e.g., `https://nird-backend.onrender.com`)

4. **Set Health Check Path:**
   ```
   /
   ```

### Option 3: Manual Web Service Setup - BACKEND

If you already have a backend web service configured in Render:

1. **Update Build Command:**
   ```
## Verifying the Fix

### Frontend Logs
After deployment, check the logs. You should see:
```
🚀 Starting NIRD Platform Frontend on 0.0.0.0:XXXXX
```

### Backend Logs
## Important Notes

### General
- The `start.sh` scripts must be executable. Render handles this automatically.
- Always use `0.0.0.0` as the host (not `localhost` or `127.0.0.1`)
- Always use the `$PORT` environment variable (Render assigns this dynamically)

### Frontend-Specific
- The `serve` package is used to serve static files in production
- Built files are in the `dist` directory
- The frontend serves as a Single Page Application (SPA)
- Make sure to set `VITE_API_URL` to point to your backend service

### Backend-Specific
- The `/health` endpoint is used by Render to monitor service health
- Database connection string should use `postgresql+psycopg2://` formats.
3. **Verify Environment Variables:**
   - `HOST` = `0.0.0.0`
   - `PORT` = (Auto-set by Render)
   - `DATABASE_URL` = Your PostgreSQL connection string
   - `ENVIRONMENT` = `production`
   - `DEBUG` = `false`

4. **Set Health Check Path:**
   ```
   /health
   ```

## Verifying the Fix

After deployment, check the logs. You should see:
```
🚀 Starting NIRD Platform Backend on 0.0.0.0:XXXXX
```

And Render should successfully detect the open port.

## Important Notes

- The `start.sh` script must be executable. Render handles this automatically.
- Always use `0.0.0.0` as the host (not `localhost` or `127.0.0.1`)
- Always use the `$PORT` environment variable (Render assigns this dynamically)
- The `/health` endpoint is used by Render to monitor service health

## Troubleshooting

If you still see port binding errors:

1. Check that `HOST=0.0.0.0` in environment variables
2. Ensure the start command uses `$PORT` variable
3. Verify logs show "Starting server on 0.0.0.0:XXXXX"
4. Make sure you're in the correct working directory (`/opt/render/project/src/backend`)
