# Frontend Deployment - Quick Fix

## The Issue
Frontend was binding to `localhost` instead of `0.0.0.0`, causing Render to not detect open ports.

## The Solution

### For Render Dashboard (Manual Setup):

**Build Command:**
```bash
npm install && npm run build
```

**Start Command:**
```bash
npx serve -s dist -l tcp://0.0.0.0:$PORT -c serve.json
```

**Environment Variables:**
- `VITE_API_URL` = `https://your-backend-url.onrender.com`

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

## Verify Success

Check Render logs for:
```
🚀 Starting NIRD Platform Frontend on 0.0.0.0:XXXXX
```

Port detection should succeed! ✨
