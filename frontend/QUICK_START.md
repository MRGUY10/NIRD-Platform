# 🚀 Quick Start Guide - NIRD Platform

## Start the Application

### 1. Start Backend (Terminal 1)
```bash
cd /Users/hobby/Downloads/NIRD-Platform-main/backend
source venv/bin/activate
uvicorn main:app --host 127.0.0.1 --port 8000 --reload
```

### 2. Start Frontend (Terminal 2)
```bash
cd /Users/hobby/Downloads/NIRD-Platform-main/frontend
npm run dev
```

### 3. Access the Platform
- 🌐 **Frontend**: http://localhost:5173
- 🔌 **Backend API**: http://127.0.0.1:8000
- 📚 **API Docs (Swagger)**: http://127.0.0.1:8000/api/docs

## 🎯 How to Use Each API Service

### Authentication
```typescript
import { authService } from '@/services';

// Login
const { access_token, user } = await authService.login({
  email: 'user@example.com',
  password: 'password123'
});

// Register
const response = await authService.register({
  email: 'new@example.com',
  password: 'password123',
  full_name: 'John Doe',
  role: 'student'
});

// Get current user
const user = await authService.getMe();

// Logout
await authService.logout();
```

### Missions
```typescript
import { missionService } from '@/services';

// Get all missions
const missions = await missionService.getMissions({
  difficulty: 'easy',
  limit: 10
});

// Get mission details
const mission = await missionService.getMissionById(1);

// Submit a mission
const submission = await missionService.submitMission({
  mission_id: 1,
  submission_text: 'My submission',
  submission_file: file // Optional File object
});

// Get my submissions
const mySubmissions = await missionService.getMySubmissions();

// Review a submission (teacher/admin only)
const reviewed = await missionService.reviewSubmission(submissionId, {
  status: 'approved',
  feedback: 'Great work!',
  points_awarded: 100
});
```

### Teams
```typescript
import { teamService } from '@/services';

// Get my team
const myTeam = await teamService.getMyTeam();

// Get all teams
const teams = await teamService.getTeams();

// Create team (teacher only)
const team = await teamService.createTeam({
  name: 'Eco Warriors',
  description: 'Fighting for the environment',
  max_members: 10
});

// Join team (student)
await teamService.joinTeam(teamId, { team_code: 'ABC123' });

// Get team stats
const stats = await teamService.getTeamStats(teamId);
```

### Leaderboard
```typescript
import { leaderboardService } from '@/services';

// Get leaderboard
const leaderboard = await leaderboardService.getLeaderboard({
  period: 'all-time',
  page_size: 50
});

// Get team history
const history = await leaderboardService.getTeamHistory(teamId, 30);

// Get stats
const stats = await leaderboardService.getStats();
```

### Badges
```typescript
import { badgeService } from '@/services';

// Get all badges
const badges = await badgeService.getAllBadges();

// Get my badges
const myBadges = await badgeService.getMyBadges();

// Get user badges
const userBadges = await badgeService.getUserBadges(userId);
```

### Resources
```typescript
import { resourceService } from '@/services';

// Get resources
const resources = await resourceService.getResources({
  resource_type: 'document',
  limit: 20
});

// Track download
await resourceService.trackDownload(resourceId);
```

### Forum
```typescript
import { forumService } from '@/services';

// Get posts
const posts = await forumService.getPosts({ limit: 50 });

// Get post details
const post = await forumService.getPostById(postId);

// Create post
const newPost = await forumService.createPost({
  title: 'My First Post',
  content: 'Hello everyone!',
  category_id: 1
});

// Get comments
const comments = await forumService.getPostComments(postId);

// Add comment
const comment = await forumService.createComment(postId, {
  content: 'Great post!'
});
```

### Stats
```typescript
import { statsService } from '@/services';

// Get global stats
const globalStats = await statsService.getGlobalStats();

// Get team stats
const teamStats = await statsService.getTeamStats(teamId);
```

### Notifications
```typescript
import { notificationService } from '@/services';

// Get notifications
const notifications = await notificationService.getNotifications({
  is_read: false
});

// Get unread count
const { count } = await notificationService.getUnreadCount();

// Mark as read
await notificationService.markAsRead(notificationId);

// Mark all as read
await notificationService.markAllAsRead();
```

## 📝 Using React Query

All API calls should use React Query for automatic caching and refetching:

```typescript
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { missionService } from '@/services';

// Fetch data
const { data: missions, isLoading, error } = useQuery({
  queryKey: ['missions'],
  queryFn: () => missionService.getMissions(),
});

// Mutate data
const queryClient = useQueryClient();

const mutation = useMutation({
  mutationFn: (data) => missionService.submitMission(data),
  onSuccess: () => {
    // Invalidate and refetch
    queryClient.invalidateQueries({ queryKey: ['my-submissions'] });
  },
});
```

## 🎨 Page Templates

### Creating a New Page

```typescript
// src/pages/MyNewPage.tsx
import { useQuery } from '@tanstack/react-query';
import { motion } from 'framer-motion';
import { Loader2 } from 'lucide-react';
import { myService } from '@/services';

export default function MyNewPage() {
  const { data, isLoading } = useQuery({
    queryKey: ['my-data'],
    queryFn: () => myService.getData(),
  });

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="w-8 h-8 animate-spin text-green-600" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-gradient-to-r from-green-600 to-emerald-600 rounded-2xl p-8 text-white">
        <h1 className="text-4xl font-bold">Page Title</h1>
        <p className="text-green-100">Page description</p>
      </div>

      {/* Content */}
      <div className="bg-white rounded-xl shadow-lg p-6">
        {/* Your content here */}
      </div>
    </div>
  );
}
```

### Add to Routes

```typescript
// src/App.tsx
import MyNewPage from './pages/MyNewPage';

// In the Routes section:
<Route path="/my-new-page" element={<MyNewPage />} />
```

### Add to Navigation

```typescript
// src/components/layouts/MainLayout.tsx
{ name: 'My Page', icon: MyIcon, path: '/my-new-page' }
```

## 🔐 Protected Routes

All routes inside `<ProtectedRoute>` require authentication:

```typescript
<Route
  element={
    <ProtectedRoute>
      <MainLayout />
    </ProtectedRoute>
  }
>
  <Route path="/dashboard" element={<DashboardPage />} />
  {/* Add more protected routes here */}
</Route>
```

## 🎯 Role-Based Access

Check user role in components:

```typescript
import { useAuthStore } from '@/store/authStore';
import { UserRole } from '@/types';

function MyComponent() {
  const { user } = useAuthStore();
  
  if (user?.role === UserRole.TEACHER) {
    return <TeacherView />;
  }
  
  if (user?.role === UserRole.STUDENT) {
    return <StudentView />;
  }
  
  return <DefaultView />;
}
```

## 🐛 Debugging

### Check API Calls
Open browser DevTools → Network tab → Filter by "XHR" to see all API requests

### Check Auth State
```typescript
import { useAuthStore } from '@/store/authStore';

function Debug() {
  const { user, token, isAuthenticated } = useAuthStore();
  console.log({ user, token, isAuthenticated });
}
```

### Check localStorage
```javascript
// In browser console
localStorage.getItem('access_token')
localStorage.getItem('auth-storage')
```

## 🆘 Common Issues

### Issue: "401 Unauthorized"
**Solution**: Token expired or invalid. Logout and login again.

### Issue: "Network Error"
**Solution**: Make sure backend is running on port 8000.

### Issue: "Cannot GET /api/..."
**Solution**: Check that the API endpoint exists in Swagger docs.

### Issue: Empty data on page
**Solution**: 
1. Check if backend has seed data
2. Check browser console for errors
3. Check Network tab for API response

## 📚 Resources

- **Backend API Docs**: http://127.0.0.1:8000/api/docs
- **React Query Docs**: https://tanstack.com/query/latest
- **Framer Motion**: https://www.framer.com/motion/
- **Tailwind CSS**: https://tailwindcss.com/docs

## ✅ Verification Checklist

- [ ] Backend running on port 8000
- [ ] Frontend running on port 5173
- [ ] Can access Swagger docs
- [ ] Can login to frontend
- [ ] Dashboard shows real data
- [ ] Can navigate to all pages
- [ ] API calls visible in Network tab

---

**Happy Coding! 🚀**
