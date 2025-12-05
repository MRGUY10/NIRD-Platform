# 🚀 NIRD Platform - Manual Deployment Guide (Free Tier)

Deploy each service separately on Render.com - Database, Backend API, and Frontend Static Site.

---

## 📊 Step 1: Create PostgreSQL Database

1. **Go to Render Dashboard**: https://dashboard.render.com
2. Click **"New +"** → **"PostgreSQL"**
3. **Configure**:
   - **Name**: `nird-platform-db`
   - **Database**: `nird_db`
   - **User**: `nird_user`
   - **Region**: Frankfurt (or your preferred region)
   - **PostgreSQL Version**: 16
   - **Plan**: **Free**
4. Click **"Create Database"**
5. ⏳ Wait 2-3 minutes for provisioning
6. **📋 COPY THIS** - Go to "Connect" section and copy:
   - **Internal Database URL** (starts with `postgresql://`)
   
   Example: `postgresql://nird_user:xxxxx@dpg-xxxxx-a/nird_db`

**✅ Database Ready!**

---

## 🐍 Step 2: Deploy Backend API (Python)

1. Click **"New +"** → **"Web Service"**
2. **Connect Repository**:
   - Click "Connect Git Provider"
   - Select **GitHub**
   - Authorize Render
   - Choose repository: **MRGUY10/NIRD-Platform**
3. **Configure Service**:
   - **Name**: `nird-platform-backend`
   - **Region**: Frankfurt (same as database)
   - **Branch**: `stim`
   - **Root Directory**: (leave blank)
   - **Runtime**: **Python 3**
   - **Build Command**: 
     ```bash
     pip install -r backend/requirements.txt
     ```
   - **Start Command**: 
     ```bash
     cd backend && alembic upgrade head && uvicorn main:app --host 0.0.0.0 --port $PORT
     ```
   - **Plan**: **Free**

4. **Environment Variables** - Click "Add Environment Variable":
   
   | Key | Value |
   |-----|-------|
   | `DATABASE_URL` | (Paste Internal Database URL from Step 1) |
   | `SECRET_KEY` | (Generate: run `python -c "import secrets; print(secrets.token_urlsafe(32))"`) |
   | `ALGORITHM` | `HS256` |
   | `ACCESS_TOKEN_EXPIRE_MINUTES` | `30` |
   | `REFRESH_TOKEN_EXPIRE_DAYS` | `7` |
   | `CORS_ORIGINS` | `*` |
   | `ENVIRONMENT` | `production` |
   | `DEBUG` | `false` |

5. Click **"Create Web Service"**
6. ⏳ Wait 5-7 minutes for build and deployment
7. **📋 COPY THIS** - Your backend URL:
   
   Example: `https://nird-platform-backend.onrender.com`

**✅ Backend Ready!**

---

## 🌐 Step 3: Deploy Frontend (Static Site)

1. Click **"New +"** → **"Static Site"**
2. **Connect Repository**:
   - Choose repository: **MRGUY10/NIRD-Platform** (if not already connected)
3. **Configure Service**:
   - **Name**: `nird-platform-frontend`
   - **Branch**: `stim`
   - **Root Directory**: (leave blank)
   - **Build Command**: 
     ```bash
     cd frontend && npm install && VITE_API_URL=https://nird-platform-backend.onrender.com/api npm run build
     ```
     ⚠️ **IMPORTANT**: Replace `https://nird-platform-backend.onrender.com` with YOUR backend URL from Step 2!
   
   - **Publish Directory**: `frontend/dist`
   - **Plan**: **Free**

4. **Add Redirect/Rewrite Rules**:
   - Scroll to **"Redirects/Rewrites"**
   - Click **"Add Rule"**
   - **Source**: `/*`
   - **Destination**: `/index.html`
   - **Action**: **Rewrite**

5. Click **"Create Static Site"**
6. ⏳ Wait 3-5 minutes for build
7. **📋 YOUR FRONTEND URL**:
   
   Example: `https://nird-platform-frontend.onrender.com`

**✅ Frontend Ready!**

---

## 🔗 Your Deployment Links

After all deployments complete, you'll have:

### 🎯 Main Application
```
https://nird-platform-frontend.onrender.com
```

### 🔌 API Backend
```
https://nird-platform-backend.onrender.com
```

### 📚 API Documentation
```
https://nird-platform-backend.onrender.com/docs
```

### 💾 Database
```
Internal only (not publicly accessible)
postgresql://nird_user:***@dpg-***/nird_db
```

---

## ✅ Step 4: Test Your Deployment

### Test Backend API
```bash
curl https://nird-platform-backend.onrender.com/health
```
Should return: `{"status":"ok"}`

### Test Frontend
Open in browser: `https://nird-platform-frontend.onrender.com`

### Test Login
- **Email**: `admin@nird.com`
- **Password**: `admin123`

---

## 🗄️ Step 5: Seed Database (Optional)

To add initial data (schools, users, missions):

1. Go to **Render Dashboard** → **nird-platform-backend**
2. Click **"Shell"** tab (top menu)
3. Run these commands:
   ```bash
   cd backend
   python seed_data.py
   ```
4. You should see: "✅ Database seeded successfully!"

---

## 🔧 Update CORS (Important!)

After deployment, update CORS to only allow your frontend:

1. Go to **Backend Service** → **Environment**
2. Edit `CORS_ORIGINS`:
   - Old: `*`
   - New: `https://nird-platform-frontend.onrender.com`
3. Click **"Save Changes"**
4. Service will auto-redeploy

---

## 🆓 Free Tier Details

### PostgreSQL Database (Free)
- ✅ 1GB storage
- ✅ 97 max connections
- ✅ Automatic backups
- ⚠️ Expires after 90 days of inactivity

### Backend Web Service (Free)
- ✅ 512MB RAM
- ✅ 750 hours/month
- ⚠️ Sleeps after 15 min inactivity
- ⚠️ First request takes ~30s to wake

### Frontend Static Site (Free)
- ✅ Unlimited bandwidth
- ✅ Global CDN
- ✅ Always active (no sleep)
- ✅ Fast delivery

---

## 🔄 How to Deploy Updates

To push updates to your live site:

```bash
cd /Users/hobby/Downloads/NIRD-Platform-main

# Make your changes, then:
git add .
git commit -m "Your update message"
git push origin stim
```

Render will **automatically redeploy** both backend and frontend! 🎉

---

## 🐛 Troubleshooting

### Backend Won't Start
- Check **Logs** tab in Render dashboard
- Verify `DATABASE_URL` is correct
- Ensure all environment variables are set
- Check Python version (needs 3.11+)

### Frontend Shows Blank Page
- Check browser console for errors
- Verify `VITE_API_URL` in build command
- Check Network tab - API calls should go to correct URL

### Database Connection Error
```
Error: could not connect to server
```
- Copy **Internal Database URL** (not External)
- Ensure backend and database are in same region
- Wait 5 minutes for database to be fully ready

### CORS Errors
```
Access to fetch has been blocked by CORS policy
```
- Update `CORS_ORIGINS` to include frontend URL
- Must include `https://` protocol
- Remove trailing slash

### 502 Bad Gateway
- Backend is spinning down (free tier)
- Wait 30 seconds and refresh
- First request after sleep takes time

---

## 📝 Important Notes

1. **Backend Sleeps**: Free tier sleeps after 15 min of inactivity
2. **First Load Slow**: Initial request may take 30s while backend wakes
3. **Database Limit**: 1GB storage on free tier
4. **No Custom Domain**: Free tier uses `.onrender.com` subdomain
5. **Auto-Deploy**: Push to `stim` branch triggers automatic redeployment

---

## 🎉 Success!

Your NIRD Platform is now live with:
- ✅ PostgreSQL Database (Free)
- ✅ Python Backend API (Free)
- ✅ React Frontend (Free)
- ✅ Automatic HTTPS
- ✅ Auto-deploy on git push

**Total Cost: $0.00/month** 💰

Enjoy your deployed NIRD Platform! 🚀
