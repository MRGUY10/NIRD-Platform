# 🚀 NIRD Platform - Render Deployment Guide

## 📋 Prerequisites
- GitHub account
- Render account (free tier: https://render.com)
- Git configured locally

## 🔧 Step 1: Push Code to GitHub

```bash
# Initialize git if not already done
cd /Users/hobby/Downloads/NIRD-Platform-main
git init

# Add all files
git add .

# Commit changes
git commit -m "Prepare for Render deployment"

# Add remote repository (replace with your repo URL)
git remote add origin https://github.com/MRGUY10/NIRD-Platform.git

# Push to GitHub
git push -u origin main
```

## 🌐 Step 2: Deploy on Render

### Option A: Deploy via render.yaml (Recommended)

1. **Login to Render Dashboard**: https://dashboard.render.com

2. **Create New Blueprint**:
   - Click "New +" → "Blueprint"
   - Connect your GitHub repository: `MRGUY10/NIRD-Platform`
   - Select branch: `main`
   - Render will automatically detect `render.yaml`

3. **Review Services**:
   - Database: `nird-platform-db` (PostgreSQL Free)
   - Backend: `nird-platform-backend` (Python Web Service)
   - Frontend: `nird-platform-frontend` (Static Site)

4. **Click "Apply"** - Render will create all 3 services automatically

### Option B: Manual Deployment

#### 2.1 Create PostgreSQL Database
1. Dashboard → "New +" → "PostgreSQL"
2. Name: `nird-platform-db`
3. Database: `nird_db`
4. User: `nird_user`
5. Region: Frankfurt (or nearest)
6. Plan: Free
7. Click "Create Database"
8. **Copy Connection String** (Internal Database URL)

#### 2.2 Deploy Backend API
1. Dashboard → "New +" → "Web Service"
2. Connect repository: `MRGUY10/NIRD-Platform`
3. Configuration:
   - **Name**: `nird-platform-backend`
   - **Region**: Frankfurt
   - **Branch**: `main`
   - **Root Directory**: Leave blank
   - **Runtime**: Python 3
   - **Build Command**: `pip install -r backend/requirements.txt`
   - **Start Command**: `cd backend && alembic upgrade head && uvicorn main:app --host 0.0.0.0 --port $PORT`
   - **Plan**: Free

4. **Environment Variables**:
   ```
   DATABASE_URL = [Paste Internal Database URL from Step 2.1]
   SECRET_KEY = [Generate random: python -c "import secrets; print(secrets.token_urlsafe(32))"]
   ALGORITHM = HS256
   ACCESS_TOKEN_EXPIRE_MINUTES = 30
   REFRESH_TOKEN_EXPIRE_DAYS = 7
   CORS_ORIGINS = *
   ENVIRONMENT = production
   DEBUG = false
   ```

5. Click "Create Web Service"
6. **Copy Backend URL**: `https://nird-platform-backend.onrender.com`

#### 2.3 Deploy Frontend
1. Dashboard → "New +" → "Static Site"
2. Connect repository: `MRGUY10/NIRD-Platform`
3. Configuration:
   - **Name**: `nird-platform-frontend`
   - **Branch**: `main`
   - **Root Directory**: Leave blank
   - **Build Command**: `cd frontend && npm install && VITE_API_URL=https://nird-platform-backend.onrender.com/api npm run build`
   - **Publish Directory**: `frontend/dist`
   - **Plan**: Free

4. **Add Rewrite Rule**:
   - Redirects/Rewrites → Add Rule
   - Source: `/*`
   - Destination: `/index.html`
   - Action: Rewrite

5. Click "Create Static Site"
6. **Copy Frontend URL**: `https://nird-platform-frontend.onrender.com`

## 🔗 Deployment URLs

After deployment completes (5-10 minutes), you'll have:

### Frontend (User Interface)
```
https://nird-platform-frontend.onrender.com
```

### Backend API
```
https://nird-platform-backend.onrender.com
```

### Database
```
Internal URL (not publicly accessible)
postgresql://nird_user:***@[host]/nird_db
```

### API Documentation
```
https://nird-platform-backend.onrender.com/docs
```

## ✅ Step 3: Verify Deployment

### Test Backend:
```bash
curl https://nird-platform-backend.onrender.com/health
```

### Test Frontend:
Open browser → `https://nird-platform-frontend.onrender.com`

### Test Login:
- Email: `admin@nird.com`
- Password: `admin123`

## 🗄️ Step 4: Initialize Database (First Time Only)

The database migrations will run automatically on backend startup via:
```bash
alembic upgrade head
```

To seed initial data:
```bash
# From Render Shell (Dashboard → Backend Service → Shell)
cd backend
python seed_data.py
```

## 🔧 Troubleshooting

### Backend Build Fails
- Check `requirements.txt` exists in `/backend` directory
- Verify Python version compatibility (3.11+)
- Check build logs for missing dependencies

### Database Connection Error
- Verify `DATABASE_URL` environment variable is set correctly
- Check database status in Render dashboard
- Ensure database allows connections (IP whitelist)

### Frontend Build Fails
- Verify `VITE_API_URL` points to correct backend URL
- Check Node version (18+)
- Verify all npm packages install correctly

### CORS Errors
- Update backend `CORS_ORIGINS` to include frontend URL:
  ```
  CORS_ORIGINS=https://nird-platform-frontend.onrender.com
  ```

## 📝 Important Notes

### Free Tier Limitations
- **Backend**: Spins down after 15 min of inactivity (first request takes 30s)
- **Database**: 1GB storage, 97 connections max
- **Frontend**: Fast, always available (static files)

### Environment Variables
Backend requires these variables:
- `DATABASE_URL` ✓
- `SECRET_KEY` ✓
- `ALGORITHM` ✓
- `ACCESS_TOKEN_EXPIRE_MINUTES` ✓
- `CORS_ORIGINS` ✓

### Database Migrations
Automatic via `alembic upgrade head` in start command

### Logs
Access logs: Dashboard → Service → Logs tab

## 🎉 Success!

Your NIRD Platform is now live on Render!

**Frontend**: https://nird-platform-frontend.onrender.com  
**Backend API**: https://nird-platform-backend.onrender.com  
**API Docs**: https://nird-platform-backend.onrender.com/docs

---

## 🔄 Future Updates

To deploy updates:
```bash
git add .
git commit -m "Update message"
git push origin main
```

Render will automatically redeploy! 🚀
