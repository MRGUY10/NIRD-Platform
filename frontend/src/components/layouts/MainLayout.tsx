import { type ReactNode, useState } from 'react';
import { Link, useNavigate, Outlet } from 'react-router-dom';
import { 
  Menu, 
  X, 
  Home, 
  Target, 
  Users, 
  Trophy, 
  Award, 
  BookOpen, 
  MessageSquare, 
  Bell, 
  User, 
  LogOut,
  BarChart3,
  Settings,
  ShieldCheck
} from 'lucide-react';
import { useAuthStore } from '../../store/authStore';
import { UserRole } from '../../types';

interface MainLayoutProps {
  children?: ReactNode;
}

export const MainLayout = ({ children }: MainLayoutProps) => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const { user, logout } = useAuthStore();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  // Navigation items based on user role
  const getNavigationItems = () => {
    if (!user) return [];

    const commonItems = [
      { name: 'Dashboard', icon: Home, path: '/dashboard' },
    ];

    if (user.role === UserRole.STUDENT) {
      return [
        ...commonItems,
        { name: 'Missions', icon: Target, path: '/missions' },
        { name: 'My Team', icon: Users, path: '/team' },
        { name: 'Leaderboard', icon: Trophy, path: '/leaderboard' },
        { name: 'Badges', icon: Award, path: '/badges' },
        { name: 'Resources', icon: BookOpen, path: '/resources' },
        { name: 'Forum', icon: MessageSquare, path: '/forum' },
        { name: 'Analytics', icon: BarChart3, path: '/analytics' },
      ];
    }

    if (user.role === UserRole.TEACHER) {
      return [
        ...commonItems,
        { name: 'Missions', icon: Target, path: '/teacher/missions' },
        { name: 'Submissions', icon: BookOpen, path: '/teacher/submissions' },
        { name: 'Students', icon: Users, path: '/teacher/students' },
        { name: 'Analytics', icon: BarChart3, path: '/teacher/analytics' },
        { name: 'Resources', icon: BookOpen, path: '/resources' },
      ];
    }

    if (user.role === UserRole.ADMIN) {
      return [
        ...commonItems,
        { name: 'Users', icon: Users, path: '/admin/users' },
        { name: 'Teams', icon: Users, path: '/admin/teams' },
        { name: 'Missions', icon: Target, path: '/admin/missions' },
        { name: 'Content', icon: ShieldCheck, path: '/admin/content' },
        { name: 'Reports', icon: BarChart3, path: '/admin/reports' },
        { name: 'Settings', icon: Settings, path: '/admin/settings' },
      ];
    }

    return commonItems;
  };

  const navigationItems = getNavigationItems();

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Top Navigation Bar */}
      <nav className="bg-white shadow-sm border-b border-gray-200 fixed w-full z-30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex items-center">
              <button
                onClick={() => setSidebarOpen(!sidebarOpen)}
                className="p-2 rounded-md text-gray-400 hover:text-gray-500 hover:bg-gray-100 lg:hidden"
              >
                {sidebarOpen ? <X size={24} /> : <Menu size={24} />}
              </button>
              <Link to="/dashboard" className="flex items-center ml-2 lg:ml-0">
                <span className="text-2xl font-bold text-primary-600">NIRD</span>
                <span className="ml-2 text-sm text-gray-500">Platform</span>
              </Link>
            </div>

            <div className="flex items-center space-x-4">
              {/* Notifications */}
              <Link
                to="/notifications"
                className="p-2 rounded-md text-gray-400 hover:text-gray-500 hover:bg-gray-100 relative"
              >
                <Bell size={20} />
                <span className="absolute top-1 right-1 block h-2 w-2 rounded-full bg-danger-500 ring-2 ring-white" />
              </Link>

              {/* User Menu */}
              <div className="flex items-center space-x-3">
                <div className="hidden md:block text-right">
                  <p className="text-sm font-medium text-gray-700">{user?.full_name}</p>
                  <p className="text-xs text-gray-500 capitalize">{user?.role}</p>
                </div>
                <Link to="/profile">
                  <div className="h-10 w-10 rounded-full bg-primary-100 flex items-center justify-center text-primary-600 font-semibold hover:bg-primary-200 transition-colors">
                    {user?.full_name?.charAt(0).toUpperCase()}
                  </div>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </nav>

      <div className="flex pt-16">
        {/* Sidebar */}
        <aside
          className={`${
            sidebarOpen ? 'translate-x-0' : '-translate-x-full'
          } lg:translate-x-0 fixed lg:static inset-y-0 left-0 z-20 w-64 bg-white border-r border-gray-200 overflow-y-auto transition-transform duration-300 ease-in-out pt-16 lg:pt-0`}
        >
          <nav className="px-3 py-4 space-y-1">
            {navigationItems.map((item) => {
              const Icon = item.icon;
              return (
                <Link
                  key={item.path}
                  to={item.path}
                  className="flex items-center px-3 py-2 text-sm font-medium rounded-md text-gray-700 hover:bg-primary-50 hover:text-primary-600 transition-colors"
                  onClick={() => setSidebarOpen(false)}
                >
                  <Icon size={20} className="mr-3" />
                  {item.name}
                </Link>
              );
            })}

            <div className="pt-4 mt-4 border-t border-gray-200">
              <Link
                to="/profile"
                className="flex items-center px-3 py-2 text-sm font-medium rounded-md text-gray-700 hover:bg-gray-100 transition-colors"
                onClick={() => setSidebarOpen(false)}
              >
                <User size={20} className="mr-3" />
                Profile
              </Link>
              <button
                onClick={handleLogout}
                className="w-full flex items-center px-3 py-2 text-sm font-medium rounded-md text-danger-600 hover:bg-danger-50 transition-colors"
              >
                <LogOut size={20} className="mr-3" />
                Logout
              </button>
            </div>
          </nav>
        </aside>

        {/* Main Content */}
        <main className="flex-1 lg:ml-0">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            {children || <Outlet />}
          </div>
        </main>
      </div>

      {/* Mobile sidebar overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-gray-600 bg-opacity-75 z-10 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}
    </div>
  );
};
