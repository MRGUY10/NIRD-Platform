# Frontend Deployment - Quick Fix ⚡

## The Issue
Frontend was binding to `localhost` instead of `0.0.0.0`, causing Render to not detect open ports.

## The Solution ✅

### RECOMMENDED: Using Node.js Express Server

**Build Command:**
```bash
npm install && npm run build
```

**Start Command (OPTION 1 - SIMPLEST):**
```bash
node server.js
```

**Start Command (OPTION 2 - Using npm):**
```bash
npm start
```

**Start Command (OPTION 3 - Using serve):**
```bash
npx serve -s dist -l 0.0.0.0:$PORT
```

**Environment Variables:**
- `VITE_API_URL` = `https://your-backend-url.onrender.com` (optional)

**Health Check Path:**
```
/
```

---

## Files Modified

✅ `frontend/package.json` - Added `serve` dependency and start script
✅ `frontend/vite.config.ts` - Preview server binds to `0.0.0.0`
✅ `frontend/start.sh` - Production start script
✅ `frontend/Procfile` - Alternative deployment config
✅ `frontend/serve.json` - SPA routing configuration
✅ `render.yaml` - Complete Blueprint with frontend service

---

## Commit and Deploy

```bash
git add .
git commit -m "Fix frontend port binding for Render deployment"
git push origin dev
```

Then redeploy in Render dashboard or use the Blueprint.

---

## Critical Steps in Render Dashboard

1. **Go to your frontend service settings**
2. **Update Build Command to:**
   ```
   npm install && npm run build
   ```
3. **Update Start Command to ONE of these (try in order):**
   
   **BEST OPTION - Use Node server:**
   ```
   node server.js
   ```
   
   **Alternative - Use npm script:**
   ```
   npm start
   ```
   
   **Last resort - Direct serve command:**
   ```
   npx serve -s dist -l 0.0.0.0:$PORT
   ```

4. **Save and Redeploy**

## Verify Success

Check Render logs for:
```
🚀 NIRD Platform Frontend running on http://0.0.0.0:XXXXX
```

The key is seeing **0.0.0.0** (not localhost or 127.0.0.1)!

Port detection should succeed! ✨

## If Still Failing

Make sure:
- ✅ Build command completes successfully (check for `dist` folder)
- ✅ Start command uses `0.0.0.0` as host
- ✅ Start command uses `$PORT` environment variable
- ✅ No hardcoded port numbers (like 3000 or 5173)
