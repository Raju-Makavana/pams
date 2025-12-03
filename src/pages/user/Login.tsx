import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { authApi } from '@/api/auth';
import { useAuthStore } from '@/store/authStore';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import Swal from 'sweetalert2';
import { Eye, EyeOff } from 'lucide-react';

interface LoginForm {
  email: string;
  password: string;
}

export default function Login() {
  const navigate = useNavigate();
  const { setUser, setToken } = useAuthStore();
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const { register, handleSubmit, formState: { errors } } = useForm<LoginForm>({
    mode: 'onBlur'
  });

  const onSubmit = async (data: LoginForm) => {
    setIsLoading(true);
    try {
      const response = await authApi.login(data);

      if (response.success) {
        setUser(response.user);
        setToken(response.token);

        Swal.fire({
          icon: 'success',
          title: 'Login Successful!',
          text: response.message || 'Welcome back!',
          confirmButtonText: 'Continue',
          timer: 2000,
          timerProgressBar: true
        });

        // Redirect based on role
        if (response.user.role_id?.name === 'admin') {
          navigate('/admin');
        } else {
          navigate('/dashboard');
        }
      }
    } catch (error: any) {
      Swal.fire({
        icon: 'error',
        title: 'Login Failed',
        text: error.response?.data?.message || 'Please check your credentials and try again.',
        confirmButtonText: 'OK'
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex">
      {/* Left Side - Image */}
      <div className="hidden lg:flex lg:w-1/2 bg-linear-to-br from-blue-600 via-indigo-600 to-purple-700 p-12 flex-col justify-between relative overflow-hidden">
        {/* Background Pattern */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-0 left-0 w-96 h-96 bg-white rounded-full -translate-x-1/2 -translate-y-1/2"></div>
          <div className="absolute bottom-0 right-0 w-96 h-96 bg-white rounded-full translate-x-1/2 translate-y-1/2"></div>
        </div>

        {/* Content */}
        <div className="relative z-10">
          <h1 className="text-white text-4xl font-bold mb-2">Pet Adoption</h1>
          <p className="text-blue-100 text-lg">Management System</p>
        </div>

        {/* Center Image/Illustration */}
        <div className="relative z-10 flex items-center justify-center">
          <div className="text-center">
            <div className="mb-6 text-white/90">
              <svg className="w-64 h-64 mx-auto" viewBox="0 0 200 200" fill="none" xmlns="http://www.w3.org/2000/svg">
                <circle cx="100" cy="100" r="80" fill="white" opacity="0.1"/>
                <circle cx="100" cy="100" r="60" fill="white" opacity="0.2"/>
                <path d="M100 140C122.091 140 140 122.091 140 100C140 77.9086 122.091 60 100 60C77.9086 60 60 77.9086 60 100C60 122.091 77.9086 140 100 140Z" fill="white" opacity="0.9"/>
                <circle cx="88" cy="92" r="6" fill="#4F46E5"/>
                <circle cx="112" cy="92" r="6" fill="#4F46E5"/>
                <path d="M85 110C85 110 92 118 100 118C108 118 115 110 115 110" stroke="#4F46E5" strokeWidth="3" strokeLinecap="round"/>
                <ellipse cx="75" cy="75" rx="12" ry="18" fill="white" opacity="0.9"/>
                <ellipse cx="125" cy="75" rx="12" ry="18" fill="white" opacity="0.9"/>
              </svg>
            </div>
            <h2 className="text-white text-3xl font-bold mb-4">Welcome Back!</h2>
            <p className="text-blue-100 text-lg">Sign in to manage pet adoptions and find loving homes</p>
          </div>
        </div>

        {/* Bottom Quote */}
        <div className="relative z-10">
          <blockquote className="text-white/90 text-lg italic">
            "Saving one animal won't change the world, but it will change the world for that one animal."
          </blockquote>
        </div>
      </div>

      {/* Right Side - Form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-8 bg-background">
        <div className="w-full max-w-md">
          {/* Logo/Brand - Mobile */}
          <div className="lg:hidden text-center mb-8">
            <Link to="/" className="inline-block cursor-pointer">
              <h1 className="text-2xl font-bold text-primary">PAMS</h1>
              <p className="text-sm text-muted-foreground">Pet Adoption Management System</p>
            </Link>
          </div>

          {/* Form Header */}
          <div className="mb-8">
            <h2 className="text-3xl font-bold mb-2">Login</h2>
            <p className="text-muted-foreground">Enter your email below to login to your account</p>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            {/* Email Field */}
            <div className="space-y-2">
              <Label htmlFor="email" className="text-sm font-medium cursor-default">
                Email *
              </Label>
              <Input
                id="email"
                type="email"
                placeholder="example@domain.com"
                className="h-12 cursor-text"
                {...register('email', {
                  required: 'Email is required',
                  pattern: {
                    value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                    message: 'Please enter a valid email address'
                  }
                })}
              />
              {errors.email && (
                <p className="text-sm text-red-500 flex items-center gap-1">
                  <span>⚠</span> {errors.email.message}
                </p>
              )}
            </div>

            {/* Password Field */}
            <div className="space-y-2">
              <Label htmlFor="password" className="text-sm font-medium cursor-default">
                Password *
              </Label>
              <div className="relative">
                <Input
                  id="password"
                  type={showPassword ? 'text' : 'password'}
                  placeholder="••••••••"
                  className="h-12 pr-10 cursor-text"
                  {...register('password', {
                    required: 'Password is required',
                    minLength: {
                      value: 6,
                      message: 'Password must be at least 6 characters'
                    }
                  })}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors cursor-pointer"
                >
                  {showPassword ? (
                    <EyeOff className="w-5 h-5" />
                  ) : (
                    <Eye className="w-5 h-5" />
                  )}
                </button>
              </div>
              {errors.password && (
                <p className="text-sm text-red-500 flex items-center gap-1">
                  <span>⚠</span> {errors.password.message}
                </p>
              )}
            </div>

            {/* Forgot Password Link */}
            <div className="flex items-center justify-end">
              <Link to="/forgot-password" className="text-sm text-primary hover:underline cursor-pointer">
                Forgot your password?
              </Link>
            </div>

            {/* Login Button */}
            <Button type="submit" className="w-full h-12 text-base font-semibold bg-gradient-to-r from-primary to-purple-600 hover:from-primary/90 hover:to-purple-600/90 text-white cursor-pointer" disabled={isLoading}>
              {isLoading ? (
                <>
                  <span className="mr-2">Signing in...</span>
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                </>
              ) : (
                'Login'
              )}
            </Button>

            {/* Register Link */}
            <div className="text-center text-sm text-muted-foreground">
              Don't have an account?{' '}
              <Link to="/register" className="text-primary hover:underline font-semibold cursor-pointer">
                Register
              </Link>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
