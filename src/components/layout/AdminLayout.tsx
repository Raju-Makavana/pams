import type { ReactNode } from 'react';
import { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuthStore } from '@/store/authStore';

import {
  LayoutDashboard,
  PawPrint,
  FileText,
  LogOut,
  Menu,
  X,
  ChevronDown,
  User
} from 'lucide-react';

interface AdminLayoutProps {
  children: ReactNode;
}

export default function AdminLayout({ children }: AdminLayoutProps) {
  const location = useLocation();
  const navigate = useNavigate();
  const { user, logout } = useAuthStore();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const menuItems = [
    { icon: LayoutDashboard, label: 'Dashboard', path: '/admin' },
    { icon: PawPrint, label: 'Pet Management', path: '/admin/pets' },
    { icon: FileText, label: 'Applications', path: '/admin/applications' },
  ];

  const isActive = (path: string) => {
    return location.pathname === path;
  };

  return (
    <div className="min-h-screen bg-muted/30">
      {/* Top Navigation Bar */}
      <nav className="bg-background border-b sticky top-0 z-40">
        <div className="flex items-center justify-between px-4 h-16">
          {/* Left: Logo + Menu Toggle */}
          <div className="flex items-center gap-4">
            <button
              onClick={() => setIsSidebarOpen(!isSidebarOpen)}
              className="lg:hidden p-2 hover:bg-muted rounded-md"
            >
              {isSidebarOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
            <Link to="/admin" className="flex items-center gap-2">
              <PawPrint className="w-8 h-8 text-primary" />
              <span className="text-xl font-bold">PAMS Admin</span>
            </Link>
          </div>

          {/* Right: User Menu */}
          <div className="relative">
            <button
              onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
              className="flex items-center gap-3 px-3 py-2 hover:bg-muted rounded-md transition-colors"
            >
              <div className="w-8 h-8 bg-primary text-primary-foreground rounded-full flex items-center justify-center">
                <User className="w-4 h-4" />
              </div>
              <div className="hidden md:block text-left">
                <div className="text-sm font-medium">{user?.name || 'Admin'}</div>
                <div className="text-xs text-muted-foreground">{user?.email}</div>
              </div>
              <ChevronDown className="w-4 h-4 text-muted-foreground" />
            </button>

            {/* Dropdown Menu */}
            {isUserMenuOpen && (
              <div className="absolute right-0 mt-2 w-48 bg-background border rounded-md shadow-lg py-1">
                <Link
                  to="/admin/profile"
                  className="block px-4 py-2 text-sm hover:bg-muted"
                  onClick={() => setIsUserMenuOpen(false)}
                >
                  Profile Settings
                </Link>
                <button
                  onClick={handleLogout}
                  className="w-full text-left px-4 py-2 text-sm hover:bg-muted text-destructive"
                >
                  <LogOut className="w-4 h-4 inline mr-2" />
                  Logout
                </button>
              </div>
            )}
          </div>
        </div>
      </nav>

      <div className="flex">
        {/* Sidebar */}
        <aside
          className={`
            fixed lg:sticky top-16 left-0 h-[calc(100vh-4rem)] w-64 bg-gradient-to-b from-blue-600/10 via-indigo-600/10 to-purple-700/10 dark:from-blue-600/20 dark:via-indigo-600/20 dark:to-purple-700/20 border-r z-30
            transition-transform duration-300 ease-in-out
            ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
          `}
        >
          <div className="p-4 space-y-2">
            {menuItems.map((item) => {
              const Icon = item.icon;
              const active = isActive(item.path);

              return (
                <Link
                  key={item.path}
                  to={item.path}
                  onClick={() => setIsSidebarOpen(false)}
                  className={`
                    flex items-center gap-3 px-4 py-3 rounded-md transition-all duration-200
                    ${active
                      ? 'bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-md'
                      : 'hover:bg-white/50 dark:hover:bg-gray-800/50 text-muted-foreground hover:text-foreground backdrop-blur-sm'
                    }
                  `}
                >
                  <Icon className="w-5 h-5" />
                  <span className="font-medium">{item.label}</span>
                </Link>
              );
            })}
          </div>

          {/* Sidebar Footer */}
          <div className="absolute bottom-0 left-0 right-0 p-4 border-t bg-gradient-to-r from-blue-500/10 to-purple-500/10 backdrop-blur-sm">
            <div className="text-xs text-muted-foreground text-center">
              <p className="font-semibold">PAMS Admin Panel</p>
              <p className="mt-1">Version 1.0.0</p>
            </div>
          </div>
        </aside>

        {/* Overlay for mobile */}
        {isSidebarOpen && (
          <div
            className="fixed inset-0 bg-black/50 z-20 lg:hidden"
            onClick={() => setIsSidebarOpen(false)}
          />
        )}

        {/* Main Content */}
        <main className="flex-1 p-6 lg:p-8">
          {children}
        </main>
      </div>
    </div>
  );
}
