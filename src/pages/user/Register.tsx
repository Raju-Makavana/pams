import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { authApi } from '@/api/auth';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import Swal from 'sweetalert2';
import { Eye, EyeOff } from 'lucide-react';

interface RegisterForm {
  name: string;
  email: string;
  password: string;
  confirmPassword: string;
  company?: string;
}

export default function Register() {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const { register, handleSubmit, watch, formState: { errors } } = useForm<RegisterForm>({
    mode: 'onBlur'
  });
  const password = watch('password');

  const onSubmit = async (data: RegisterForm) => {
    setIsLoading(true);
    try {
      const { confirmPassword, ...registerData } = data;
      const response = await authApi.register(registerData);

      if (response.success) {
        Swal.fire({
          icon: 'success',
          title: 'Registration Successful!',
          text: 'Please login with your credentials.',
          confirmButtonText: 'Go to Login'
        }).then(() => {
          navigate('/login');
        });
      }
    } catch (error: any) {
      Swal.fire({
        icon: 'error',
        title: 'Registration Failed',
        text: error.response?.data?.message || 'Registration failed. Please try again.',
        confirmButtonText: 'OK'
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex">
      {/* Left Side - Image */}
      <div className="hidden lg:flex lg:w-1/2 bg-linear-to-br from-purple-600 via-pink-600 to-rose-700 p-12 flex-col justify-between relative overflow-hidden">
        {/* Background Pattern */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-20 right-20 w-72 h-72 bg-white rounded-full"></div>
          <div className="absolute bottom-20 left-20 w-96 h-96 bg-white rounded-full"></div>
          <div className="absolute top-1/2 left-1/3 w-48 h-48 bg-white rounded-full"></div>
        </div>

        {/* Content */}
        <div className="relative z-10">
          <h1 className="text-white text-4xl font-bold mb-2">Join Our Community</h1>
          <p className="text-purple-100 text-lg">Start Your Journey Today</p>
        </div>

        {/* Center Image/Illustration */}
        <div className="relative z-10 flex items-center justify-center">
          <div className="text-center">
            <div className="mb-6">
              <svg className="w-72 h-72 mx-auto" viewBox="0 0 240 240" fill="none" xmlns="http://www.w3.org/2000/svg">
                {/* Dog */}
                <ellipse cx="85" cy="120" rx="35" ry="45" fill="white" opacity="0.9"/>
                <circle cx="75" cy="110" r="5" fill="#9333EA"/>
                <path d="M70 125C70 125 75 130 85 130C95 130 100 125 100 125" stroke="#9333EA" strokeWidth="2.5" strokeLinecap="round"/>
                <ellipse cx="60" cy="95" rx="10" ry="20" fill="white" opacity="0.9"/>
                <ellipse cx="110" cy="95" rx="10" ry="20" fill="white" opacity="0.9"/>

                {/* Cat */}
                <ellipse cx="155" cy="120" rx="35" ry="45" fill="white" opacity="0.9"/>
                <circle cx="145" cy="110" r="5" fill="#9333EA"/>
                <circle cx="165" cy="110" r="5" fill="#9333EA"/>
                <path d="M140 125C140 125 147 132 155 132C163 132 170 125 170 125" stroke="#9333EA" strokeWidth="2.5" strokeLinecap="round"/>
                <path d="M125 85 L135 105 L145 85" stroke="white" strokeWidth="3" fill="white" opacity="0.9"/>
                <path d="M165 85 L175 105 L185 85" stroke="white" strokeWidth="3" fill="white" opacity="0.9"/>

                {/* Hearts */}
                <path d="M120 70 C120 65 125 60 130 65 C135 60 140 65 140 70 C140 80 130 85 130 85 C130 85 120 80 120 70Z" fill="white" opacity="0.8"/>
                <path d="M100 165 C100 160 105 155 110 160 C115 155 120 160 120 165 C120 175 110 180 110 180 C110 180 100 175 100 165Z" fill="white" opacity="0.7"/>
              </svg>
            </div>
            <h2 className="text-white text-3xl font-bold mb-4">Create Your Account</h2>
            <p className="text-purple-100 text-lg max-w-md mx-auto">
              Join thousands of pet lovers making a difference in animals' lives
            </p>
          </div>
        </div>

        {/* Bottom Stats */}
        <div className="relative z-10 grid grid-cols-3 gap-4 text-center">
          <div>
            <div className="text-white text-3xl font-bold">500+</div>
            <div className="text-purple-100 text-sm">Pets Adopted</div>
          </div>
          <div>
            <div className="text-white text-3xl font-bold">1000+</div>
            <div className="text-purple-100 text-sm">Happy Families</div>
          </div>
          <div>
            <div className="text-white text-3xl font-bold">50+</div>
            <div className="text-purple-100 text-sm">Available Pets</div>
          </div>
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
            <h2 className="text-3xl font-bold mb-2">Create an Account</h2>
            <p className="text-muted-foreground">Enter your information to get started</p>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
            {/* Name Field */}
            <div className="space-y-2">
              <Label htmlFor="name" className="text-sm font-medium cursor-default">
                Full Name *
              </Label>
              <Input
                id="name"
                placeholder="John Doe"
                className="h-12 cursor-text"
                {...register('name', {
                  required: 'Name is required',
                  minLength: {
                    value: 2,
                    message: 'Name must be at least 2 characters'
                  }
                })}
              />
              {errors.name && (
                <p className="text-sm text-red-500 flex items-center gap-1">
                  <span>⚠</span> {errors.name.message}
                </p>
              )}
            </div>

            {/* Email Field */}
            <div className="space-y-2">
              <Label htmlFor="email" className="text-sm font-medium cursor-default">
                Email *
              </Label>
              <Input
                id="email"
                type="email"
                placeholder="john@example.com"
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

            {/* Confirm Password Field */}
            <div className="space-y-2">
              <Label htmlFor="confirmPassword" className="text-sm font-medium cursor-default">
                Confirm Password *
              </Label>
              <div className="relative">
                <Input
                  id="confirmPassword"
                  type={showConfirmPassword ? 'text' : 'password'}
                  placeholder="••••••••"
                  className="h-12 pr-10 cursor-text"
                  {...register('confirmPassword', {
                    required: 'Please confirm your password',
                    validate: value => value === password || 'Passwords do not match'
                  })}
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors cursor-pointer"
                >
                  {showConfirmPassword ? (
                    <EyeOff className="w-5 h-5" />
                  ) : (
                    <Eye className="w-5 h-5" />
                  )}
                </button>
              </div>
              {errors.confirmPassword && (
                <p className="text-sm text-red-500 flex items-center gap-1">
                  <span>⚠</span> {errors.confirmPassword.message}
                </p>
              )}
            </div>

            {/* Company Field (Optional) */}
            <div className="space-y-2">
              <Label htmlFor="company" className="text-sm font-medium cursor-default">Company (Optional)</Label>
              <Input
                id="company"
                placeholder="ABC Corporation"
                className="h-12 cursor-text"
                {...register('company')}
              />
            </div>

            {/* Register Button */}
            <Button type="submit" className="w-full h-12 text-base font-semibold bg-gradient-to-r from-primary to-purple-600 hover:from-primary/90 hover:to-purple-600/90 text-white cursor-pointer" disabled={isLoading}>
              {isLoading ? (
                <>
                  <span className="mr-2">Creating Account...</span>
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                </>
              ) : (
                'Create Account'
              )}
            </Button>

            {/* Login Link */}
            <div className="text-center text-sm text-muted-foreground">
              Already have an account?{' '}
              <Link to="/login" className="text-primary hover:underline font-semibold cursor-pointer">
                Sign in
              </Link>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
