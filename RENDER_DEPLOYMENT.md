# Render Deployment Guide

## Issue Fixed: Port Binding

The application now properly binds to `0.0.0.0` and uses the `PORT` environment variable set by Render.

## Changes Made

1. **start.sh** - Created a startup script that:
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

### Option 2: Manual Web Service Setup

If you already have a web service configured in Render:

1. **Update Build Command:**
   ```
   pip install -r requirements.txt
   ```

2. **Update Start Command:**
   ```
   bash start.sh
   ```

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

### Option 3: Direct uvicorn Command

If you prefer not to use the start.sh script, update your Start Command to:

```
uvicorn main:app --host 0.0.0.0 --port $PORT --workers 2
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
