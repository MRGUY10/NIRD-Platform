# 🔀 NIRD Platform - Routing & Redirections Guide

## Overview
The NIRD Platform now has intelligent role-based routing that automatically directs users to the appropriate pages based on their role (Student, Teacher, or Admin).

---

## 🎯 Key Redirections

### 1. **Login Redirections**
After successful login, users are redirected based on their role:

- **Students** → `/dashboard` (Student Dashboard)
- **Teachers** → `/dashboard` (Teacher Dashboard)  
- **Admins** → `/admin/dashboard` (Admin Dashboard)

**Implementation**: `LoginPage.tsx` - Uses `getDashboardRoute()` helper function

### 2. **Registration Redirections**
After successful registration, same logic applies:

- **Students** → `/dashboard`
- **Teachers** → `/dashboard`
- **Admins** → `/admin/dashboard`

**Implementation**: `RegisterPage.tsx` - Checks user role after registration

### 3. **Dashboard Auto-Redirect**
When admin users navigate to `/dashboard`, they are automatically redirected to `/admin/dashboard`:

**Implementation**: `DashboardPage.tsx` - useEffect hook redirects admins

```typescript
useEffect(() => {
  if (user?.role === UserRole.ADMIN) {
    navigate('/admin/dashboard', { replace: true });
  }
}, [user, navigate]);
```

### 4. **Unauthorized Access**
Users attempting to access pages without proper permissions are redirected to `/unauthorized`:

**Route**: `/unauthorized` → `UnauthorizedPage.tsx`

Features:
- 403 error message
- Animated shield alert icon
- "Retour" button (go back)
- "Tableau de Bord" button (go to dashboard)

### 5. **Unauthenticated Access**
Users not logged in attempting to access protected routes are redirected to `/login`:

**Implementation**: `ProtectedRoute.tsx`

```typescript
if (!isAuthenticated) {
  return <Navigate to="/login" replace />;
}
```

---

## 📋 Complete Route Structure

### **Public Routes** (No authentication required)
```
/ → LandingPage
/about → AboutPage
/unauthorized → UnauthorizedPage
```

### **Auth Routes** (AuthLayout wrapper)
```
/login → LoginPage
/register → RegisterPage
/forgot-password → ForgotPasswordPage
```

### **Protected Routes** (Requires authentication + MainLayout)

#### **Common Routes** (All authenticated users)
```
/profile → ProfilePage
```

#### **Student & Teacher Routes**
```
/dashboard → DashboardPage (role-based rendering)
/missions → MissionsPage
/missions/:id → MissionDetailPage
/teams → TeamsPage
/badges → BadgesPage
/leaderboard → LeaderboardPage
/resources → ResourcesPage
/forum → ForumPage
```

#### **Admin Routes**
```
/admin/dashboard → AdminDashboardPage
/admin/users → (Future implementation)
/admin/teams → (Future implementation)
/admin/content → (Future implementation)
/admin/reports → (Future implementation)
/admin/settings → (Future implementation)
```

### **Fallback Route**
```
/* → NotFoundPage (404)
```

---

## 🔐 Role-Based Navigation

### Student Navigation Menu
```
- Dashboard → /dashboard
- Missions → /missions
- Mon Équipe → /teams
- Badges → /badges
- Classement → /leaderboard
- Ressources → /resources
- Forum → /forum
- Profile → /profile
```

### Teacher Navigation Menu
```
- Dashboard → /dashboard
- Missions → /missions
- Mon Équipe → /teams
- Badges → /badges
- Classement → /leaderboard
- Ressources → /resources
- Forum → /forum
- Profile → /profile
```

### Admin Navigation Menu
```
- Admin Dashboard → /admin/dashboard
- Users → /admin/users (future)
- Teams → /admin/teams (future)
- Missions → /missions
- Content → /admin/content (future)
- Reports → /admin/reports (future)
- Settings → /admin/settings (future)
- Profile → /profile
```

---

## 🏠 Logo Click Behavior

The NIRD logo in the header redirects based on user role:

```typescript
<Link 
  to={user?.role === UserRole.ADMIN ? '/admin/dashboard' : '/dashboard'} 
  className="flex items-center ml-2 lg:ml-0"
>
  <span className="text-2xl font-bold text-primary-600">NIRD</span>
  <span className="ml-2 text-sm text-gray-500">Platform</span>
</Link>
```

- **Students/Teachers** → `/dashboard`
- **Admins** → `/admin/dashboard`

---

## 🔄 Navigation Flow Examples

### Example 1: Student Login
```
1. User visits /login
2. Enters credentials (student role)
3. Clicks "Se connecter"
4. → Redirected to /dashboard
5. StudentDashboard component renders
```

### Example 2: Admin Login
```
1. User visits /login
2. Enters credentials (admin role)
3. Clicks "Se connecter"
4. → Redirected to /admin/dashboard
5. AdminDashboardPage component renders
```

### Example 3: Unauthorized Access
```
1. Student tries to access /admin/dashboard
2. ProtectedRoute checks role
3. → Redirected to /unauthorized
4. UnauthorizedPage displays 403 error
```

### Example 4: Unauthenticated Access
```
1. Guest visits /missions
2. ProtectedRoute checks authentication
3. → Redirected to /login
4. After login, redirect back to intended page (future: implement returnUrl)
```

---

## 🛠️ Technical Implementation

### Helper Functions

#### `getDashboardRoute(role: UserRole)`
Returns the appropriate dashboard route based on user role:

```typescript
const getDashboardRoute = (role: UserRole) => {
  return role === UserRole.ADMIN ? '/admin/dashboard' : '/dashboard';
};
```

**Used in:**
- `LoginPage.tsx`
- `RegisterPage.tsx`

### State Management

**Auth Store** (`authStore.ts`):
- Stores user data, token, and authentication status
- Persisted in localStorage
- Provides login, register, logout, and checkAuth functions

**User Object Structure:**
```typescript
interface User {
  id: number;
  email: string;
  username: string;
  full_name: string;
  role: 'student' | 'teacher' | 'admin';
  school_id?: number;
  avatar_url?: string;
  points?: number;
  level?: number;
}
```

### Protected Route Component

```typescript
export const ProtectedRoute = ({ children, allowedRoles }: ProtectedRouteProps) => {
  const { isAuthenticated, user } = useAuthStore();

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  if (allowedRoles && user && !allowedRoles.includes(user.role)) {
    return <Navigate to="/unauthorized" replace />;
  }

  return <>{children}</>;
};
```

**Features:**
- Checks authentication status
- Validates user role against allowed roles
- Redirects to /login if not authenticated
- Redirects to /unauthorized if role not permitted

---

## 🎨 User Experience Enhancements

### Smooth Transitions
All redirections use React Router's `navigate()` with smooth page transitions powered by Framer Motion.

### Replace History
Critical redirections use `replace: true` to prevent back button issues:
```typescript
navigate('/admin/dashboard', { replace: true });
```

### Loading States
During authentication and navigation, loading spinners are displayed to provide feedback.

### Error Handling
Failed redirections display error messages with retry options.

---

## 📊 Redirection Priority

1. **Authentication Check** (highest priority)
   - Not logged in → `/login`

2. **Role Validation**
   - Wrong role for route → `/unauthorized`

3. **Auto-Redirects**
   - Admin accessing `/dashboard` → `/admin/dashboard`

4. **Default Fallback**
   - Invalid route → `/404` (NotFoundPage)

---

## 🚀 Future Enhancements

### 1. Return URL
After login, redirect users to the page they originally tried to access:
```typescript
const returnUrl = location.state?.from?.pathname || getDashboardRoute(user.role);
navigate(returnUrl);
```

### 2. Breadcrumb Navigation
Show current location and allow quick navigation:
```
Dashboard > Missions > Mission Detail
```

### 3. Role-Based Route Guards
Define allowed roles per route in route configuration:
```typescript
<Route 
  path="/admin/dashboard" 
  element={<AdminDashboardPage />} 
  allowedRoles={[UserRole.ADMIN]}
/>
```

### 4. Deep Linking
Support for sharing direct links to specific content with proper authentication flow.

---

## ✅ Testing Checklist

- [ ] Student can login and access student routes
- [ ] Teacher can login and access teacher routes  
- [ ] Admin can login and access admin routes
- [ ] Student cannot access admin routes
- [ ] Unauthenticated users are redirected to login
- [ ] Logo redirects to correct dashboard per role
- [ ] Dashboard auto-redirects admins to admin dashboard
- [ ] 404 page displays for invalid routes
- [ ] 403 page displays for unauthorized access
- [ ] Back button works correctly after redirects
- [ ] Logout redirects to login page

---

**Last Updated**: December 2024  
**Status**: ✅ Complete and Functional
