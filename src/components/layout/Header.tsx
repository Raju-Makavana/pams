import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuthStore } from '@/store/authStore';
import { Button } from '@/components/ui/button';
import { authApi } from '@/api/auth';
import Swal from 'sweetalert2';
import { PawPrint, LayoutDashboard, FileText, LogOut, User, Menu, X } from 'lucide-react';

export default function Header() {
  const navigate = useNavigate();
  const { user, isAuthenticated, logout } = useAuthStore();
  const isAdmin = user?.role_id?.name === 'admin';
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleLogout = async () => {
    // Show confirmation dialog
    const result = await Swal.fire({
      icon: 'question',
      title: 'Confirm Logout',
      text: 'Are you sure you want to logout?',
      showCancelButton: true,
      confirmButtonText: 'Yes, Logout',
      cancelButtonText: 'Cancel',
      confirmButtonColor: '#d33',
      cancelButtonColor: '#3085d6'
    });

    // If user confirmed, proceed with logout
    if (result.isConfirmed) {
      try {
        await authApi.logout();
        logout();
        Swal.fire({
          icon: 'success',
          title: 'Logged Out',
          text: 'You have been logged out successfully',
          confirmButtonText: 'OK',
          timer: 2000,
          timerProgressBar: true
        });
        navigate('/');
      } catch (error) {
        logout();
        navigate('/');
      }
    }
  };

  return (
    <header className="border-b border-border bg-background/95 backdrop-blur supports-backdrop-filter:bg-background/60 sticky top-0 z-50">
      <div className="container mx-auto px-4 h-16 flex items-center justify-between">
        <Link to="/" className="flex items-center gap-2">
          <PawPrint className="w-8 h-8 text-primary" />
          <span className="text-xl font-bold">PAMS</span>
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center gap-6">
          <Link to="/pets" className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors cursor-pointer">
            Browse Pets
          </Link>
          {isAuthenticated && !isAdmin && (
            <>
              <Link to="/dashboard" className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors flex items-center gap-1 cursor-pointer">
                <LayoutDashboard className="w-4 h-4" />
                Dashboard
              </Link>
              <Link to="/my-applications" className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors flex items-center gap-1 cursor-pointer">
                <FileText className="w-4 h-4" />
                My Applications
              </Link>
            </>
          )}
          {isAdmin && (
            <>
              <Link to="/admin" className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors flex items-center gap-1 cursor-pointer">
                <LayoutDashboard className="w-4 h-4" />
                Admin Dashboard
              </Link>
              <Link to="/admin/pets" className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors flex items-center gap-1 cursor-pointer">
                <PawPrint className="w-4 h-4" />
                Manage Pets
              </Link>
              <Link to="/admin/applications" className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors flex items-center gap-1 cursor-pointer">
                <FileText className="w-4 h-4" />
                Applications
              </Link>
            </>
          )}
        </nav>

        {/* Desktop Auth Buttons */}
        <div className="hidden md:flex items-center gap-4">
          {isAuthenticated ? (
            <>
              <div className="flex items-center gap-2 text-sm">
                <div className="w-8 h-8 bg-primary text-primary-foreground rounded-full flex items-center justify-center">
                  <User className="w-4 h-4" />
                </div>
                <span className="text-muted-foreground">
                  {user?.name}
                </span>
              </div>
              <Button variant="ghost" onClick={handleLogout} className="cursor-pointer">
                <LogOut className="w-4 h-4 mr-2" />
                Logout
              </Button>
            </>
          ) : (
            <>
              <Link to="/login">
                <Button variant="ghost" className="cursor-pointer">Login</Button>
              </Link>
              <Link to="/register">
                <Button className="cursor-pointer bg-gradient-to-r from-primary to-purple-600 hover:from-primary/90 hover:to-purple-600/90 text-white">Sign Up</Button>
              </Link>
            </>
          )}
        </div>

        {/* Mobile Menu Button */}
        <button
          className="md:hidden p-2 text-muted-foreground hover:text-foreground transition-colors cursor-pointer"
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          aria-label="Toggle menu"
        >
          {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>
      </div>

      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden border-t border-border bg-background">
          <nav className="container mx-auto px-4 py-4 flex flex-col gap-4">
            <Link
              to="/pets"
              className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors py-2 cursor-pointer"
              onClick={() => setMobileMenuOpen(false)}
            >
              Browse Pets
            </Link>

            {isAuthenticated && !isAdmin && (
              <>
                <Link
                  to="/dashboard"
                  className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors flex items-center gap-2 py-2 cursor-pointer"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  <LayoutDashboard className="w-4 h-4" />
                  Dashboard
                </Link>
                <Link
                  to="/my-applications"
                  className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors flex items-center gap-2 py-2 cursor-pointer"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  <FileText className="w-4 h-4" />
                  My Applications
                </Link>
              </>
            )}

            {isAdmin && (
              <>
                <Link
                  to="/admin"
                  className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors flex items-center gap-2 py-2 cursor-pointer"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  <LayoutDashboard className="w-4 h-4" />
                  Admin Dashboard
                </Link>
                <Link
                  to="/admin/pets"
                  className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors flex items-center gap-2 py-2 cursor-pointer"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  <PawPrint className="w-4 h-4" />
                  Manage Pets
                </Link>
                <Link
                  to="/admin/applications"
                  className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors flex items-center gap-2 py-2 cursor-pointer"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  <FileText className="w-4 h-4" />
                  Applications
                </Link>
              </>
            )}

            <div className="pt-4 border-t border-border flex flex-col gap-3">
              {isAuthenticated ? (
                <>
                  <div className="flex items-center gap-2 py-2">
                    <div className="w-8 h-8 bg-primary text-primary-foreground rounded-full flex items-center justify-center">
                      <User className="w-4 h-4" />
                    </div>
                    <span className="text-sm text-muted-foreground">{user?.name}</span>
                  </div>
                  <Button
                    variant="ghost"
                    className="justify-start cursor-pointer"
                    onClick={() => {
                      handleLogout();
                      setMobileMenuOpen(false);
                    }}
                  >
                    <LogOut className="w-4 h-4 mr-2" />
                    Logout
                  </Button>
                </>
              ) : (
                <>
                  <Link to="/login" onClick={() => setMobileMenuOpen(false)}>
                    <Button variant="ghost" className="w-full justify-start cursor-pointer">Login</Button>
                  </Link>
                  <Link to="/register" onClick={() => setMobileMenuOpen(false)}>
                    <Button className="w-full cursor-pointer bg-gradient-to-r from-primary to-purple-600 hover:from-primary/90 hover:to-purple-600/90 text-white">Sign Up</Button>
                  </Link>
                </>
              )}
            </div>
          </nav>
        </div>
      )}
    </header>
  );
}
