# 🚀 NIRD Platform - Quick Start Guide

## ✅ Current Status: FULLY INTEGRATED & RUNNING

### Servers Running:
- ✅ **Backend API**: http://127.0.0.1:8000
- ✅ **Frontend App**: http://localhost:3001
- ✅ **API Documentation**: http://127.0.0.1:8000/api/docs

---

## 🎯 Features Completed

### 1. **User Profile Management**
- ✅ View and edit profile information
- ✅ Real-time statistics (points, missions, badges)
- ✅ User level and rank display with progress bars
- ✅ Team information display
- ✅ Password change functionality
- ✅ Avatar management

### 2. **User Ranking System**
6-tier level system based on points earned:
- **Novice** (0-99 pts) - Gray
- **Explorer** (100-249 pts) - Green  
- **Contributor** (250-499 pts) - Blue
- **Champion** (500-999 pts) - Purple
- **Master** (1000-1999 pts) - Orange
- **Legend** (2000+ pts) - Red

### 3. **Admin Management**
- ✅ Complete admin dashboard with platform statistics
- ✅ User management interface (view, edit, activate/deactivate, delete)
- ✅ User search and filtering by role
- ✅ Real-time user rankings and level distribution
- ✅ Team management capabilities
- ✅ Mission and submission oversight

### 4. **Dynamic Pages**
All pages now fetch real data from backend:
- ✅ Profile Page - User stats with levels
- ✅ About Page - Real-time global statistics
- ✅ Admin Dashboard - Platform metrics
- ✅ Admin Users Page - Complete user CRUD
- ✅ Dashboard - Role-based views
- ✅ Missions, Teams, Leaderboard, Resources, Forum, Badges

---

## 🔧 How to Start the Application

### Terminal 1 - Backend
```bash
cd /Users/hobby/Downloads/NIRD-Platform-main/backend
/Users/hobby/Downloads/NIRD-Platform-main/backend/venv/bin/python main.py
```

### Terminal 2 - Frontend
```bash
cd /Users/hobby/Downloads/NIRD-Platform-main/frontend
npm run dev
```

### Access the Application
- **Frontend**: http://localhost:3001 (or http://localhost:5173)
- **Backend API**: http://127.0.0.1:8000
- **API Docs**: http://127.0.0.1:8000/api/docs

---

## 🧪 Testing the Features

### 1. User Registration & Login
1. Go to http://localhost:3001
2. Click "Get Started" or "Register"
3. Create an account (student/teacher/admin)
4. Login with your credentials

### 2. Profile Management
1. Login to your account
2. Navigate to "Profile" in the sidebar
3. View your statistics: points, level, rank, missions, badges
4. Click "Edit" to update your profile
5. See your level progress bar and rank

### 3. View Rankings
1. Go to Leaderboard page
2. See all users ranked by points
3. View user levels and badges

### 4. Admin Features (Admin Account Only)
1. Login with admin credentials
2. Navigate to "Admin Dashboard"
3. View platform statistics:
   - Total users, teams, missions
   - Active users, submissions
   - Recent activity
4. Click "Users" in sidebar
5. User Management:
   - Search users by name/email
   - Filter by role (student/teacher/admin)
   - View user statistics and levels
   - Activate/Deactivate users
   - Delete users
   - View detailed user information

### 5. About Page
1. Visit the About page
2. See real-time statistics:
   - Total users and teams
   - Missions completed
   - Devices saved
   - Environmental impact metrics

---

## 📚 API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login
- `GET /api/auth/me` - Get current user
- `PUT /api/auth/profile` - Update profile
- `PUT /api/auth/change-password` - Change password

### Users (NEW)
- `GET /api/users/me/stats` - Get my statistics with level/rank
- `GET /api/users/rankings` - User leaderboard
- `GET /api/users/{id}` - Get user by ID
- `GET /api/users/{id}/stats` - Get user stats

### Admin
- `GET /api/admin/dashboard` - Dashboard stats
- `GET /api/admin/users` - List users
- `GET /api/admin/users/{id}` - Get user details
- `PUT /api/admin/users/{id}` - Update user
- `DELETE /api/admin/users/{id}` - Delete user
- `GET /api/admin/teams` - List teams
- `GET /api/admin/submissions` - Pending submissions

### Statistics
- `GET /api/stats/global` - Global platform stats
- `GET /api/stats/team/{id}` - Team statistics

### Other Routes
- Teams: `/api/teams/*`
- Missions: `/api/missions/*`
- Leaderboard: `/api/leaderboard/*`
- Resources: `/api/resources/*`
- Forum: `/api/forum/*`
- Badges: `/api/badges/*`
- Notifications: `/api/notifications/*`

---

## 🎨 New Features Highlights

### Profile Page
- Dynamic user statistics
- Level progression with animated progress bar
- Color-coded level badges
- Real-time points and rank tracking
- Team information display
- Mission completion count
- Badges earned display

### Admin Users Page
- Comprehensive user table
- Search functionality
- Role-based filtering
- User statistics in table
- Quick actions (view, activate, delete)
- User details modal
- Summary statistics cards
- Export functionality (placeholder)

### User Level System
- Automatic level calculation based on points
- Progress tracking to next level
- Color-coded level names
- Percentage-based progress bars
- Visual level indicators throughout the app

---

## 🔐 Default Test Accounts

If you have seed data, you can use:
- **Admin**: Check seed_data.py for admin credentials
- **Teacher**: Check seed_data.py for teacher credentials
- **Student**: Check seed_data.py for student credentials

Or create new accounts via registration.

---

## 📊 Database

**PostgreSQL** database with all tables initialized:
- users
- schools
- teams
- team_members
- categories
- missions
- mission_submissions
- badges
- user_badges
- resources
- forum_posts
- comments
- notifications
- leaderboard_snapshots

---

## 🎯 Key Accomplishments

✅ **Backend-Frontend Complete Integration**
✅ **User Profile Management with CRUD**
✅ **6-Tier User Ranking System**
✅ **Real-time Statistics on All Pages**
✅ **Admin Dashboard with Full Metrics**
✅ **Admin User Management Interface**
✅ **Dynamic Data Fetching with React Query**
✅ **Level-based Gamification**
✅ **Environmental Impact Tracking**
✅ **Role-based Access Control**
✅ **Modern UI with Animations**

---

## 🌟 Next Steps (Optional Enhancements)

1. Add avatar upload functionality
2. Implement WebSocket for real-time notifications
3. Add email verification
4. Create team management pages for admins
5. Add mission creation interface
6. Implement advanced analytics
7. Add CSV/PDF export for admin reports
8. Create content moderation tools
9. Add bulk user operations
10. Implement audit logging

---

## 📝 Notes

- All pages are fully dynamic and fetch real data from backend
- User authentication is fully functional with JWT tokens
- Protected routes ensure proper access control
- React Query handles caching and real-time updates
- Framer Motion provides smooth animations
- Tailwind CSS ensures responsive design

---

## 🎉 Success!

The NIRD Platform is now **fully integrated** with a complete backend-frontend connection, dynamic user management, ranking system, and admin capabilities. All features are working seamlessly together!

**Enjoy exploring the platform!** 🌱♻️🌍
