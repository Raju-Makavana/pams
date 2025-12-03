import { useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import Swal from 'sweetalert2';
import { ArrowLeft, Lock, Eye, EyeOff, CheckCircle } from 'lucide-react';
import { authApi } from '@/api/auth';

interface ResetPasswordForm {
  password: string;
  confirmPassword: string;
}

export default function ResetPassword() {
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const navigate = useNavigate();
  const { token } = useParams<{ token: string }>();

  const { register, handleSubmit, watch, formState: { errors } } = useForm<ResetPasswordForm>({
    mode: 'onBlur'
  });

  const password = watch('password');

  const onSubmit = async (data: ResetPasswordForm) => {
    if (!token) {
      Swal.fire({
        icon: 'error',
        title: 'Invalid Link',
        text: 'The password reset link is invalid.',
        confirmButtonText: 'OK'
      });
      return;
    }

    setIsLoading(true);
    try {
      // Call reset password API endpoint
      await authApi.resetPassword(token, {
        password: data.password,
        confirmPassword: data.confirmPassword
      });

      await Swal.fire({
        icon: 'success',
        title: 'Password Reset Successful!',
        text: 'Your password has been reset successfully. You can now log in with your new password.',
        confirmButtonText: 'Go to Login'
      });

      navigate('/login');
    } catch (error: any) {
      Swal.fire({
        icon: 'error',
        title: 'Reset Failed',
        text: error.response?.data?.message || 'Failed to reset password. The link may have expired.',
        confirmButtonText: 'OK'
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex">
      {/* Left Side - Image */}
      <div className="hidden lg:flex lg:w-1/2 bg-gradient-to-br from-blue-600 via-indigo-600 to-purple-700 p-12 flex-col justify-between relative overflow-hidden">
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
                {/* Key Icon */}
                <circle cx="85" cy="85" r="15" fill="white" opacity="0.9"/>
                <rect x="95" y="80" width="30" height="10" rx="2" fill="white" opacity="0.9"/>
                <rect x="115" y="75" width="4" height="8" fill="white" opacity="0.9"/>
                <rect x="108" y="75" width="4" height="8" fill="white" opacity="0.9"/>
                <circle cx="85" cy="85" r="6" fill="#4F46E5"/>
              </svg>
            </div>
            <h2 className="text-white text-3xl font-bold mb-4">Reset Password</h2>
            <p className="text-blue-100 text-lg">Create a strong, secure password for your account.</p>
          </div>
        </div>

        {/* Bottom Quote */}
        <div className="relative z-10">
          <blockquote className="text-white/90 text-lg italic">
            "A strong password is the first line of defense."
          </blockquote>
        </div>
      </div>

      {/* Right Side - Form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-8 bg-background">
        <div className="w-full max-w-md">
          {/* Logo/Brand - Mobile */}
          <div className="lg:hidden text-center mb-8">
            <h1 className="text-2xl font-bold text-primary">PAMS</h1>
            <p className="text-sm text-muted-foreground">Pet Adoption Management System</p>
          </div>

          {/* Back to Login Link */}
          <Link
            to="/login"
            className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground mb-6 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Login
          </Link>

          <Card>
            <CardHeader>
              <CardTitle className="text-2xl">Reset Password</CardTitle>
              <CardDescription>
                Enter your new password below
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                {/* New Password Field */}
                <div className="space-y-2">
                  <Label htmlFor="password" className="text-sm font-medium cursor-default">
                    New Password *
                  </Label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                    <Input
                      id="password"
                      type={showPassword ? 'text' : 'password'}
                      placeholder="Enter new password"
                      className="h-12 pl-10 pr-10 cursor-text"
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
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground cursor-pointer"
                    >
                      {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
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
                    <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                    <Input
                      id="confirmPassword"
                      type={showConfirmPassword ? 'text' : 'password'}
                      placeholder="Re-enter new password"
                      className="h-12 pl-10 pr-10 cursor-text"
                      {...register('confirmPassword', {
                        required: 'Please confirm your password',
                        validate: value =>
                          value === password || 'Passwords do not match'
                      })}
                    />
                    <button
                      type="button"
                      onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground cursor-pointer"
                    >
                      {showConfirmPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                  {errors.confirmPassword && (
                    <p className="text-sm text-red-500 flex items-center gap-1">
                      <span>⚠</span> {errors.confirmPassword.message}
                    </p>
                  )}
                </div>

                {/* Password Requirements */}
                <div className="bg-muted p-4 rounded-lg">
                  <p className="text-sm font-medium mb-2">Password must:</p>
                  <ul className="text-sm text-muted-foreground space-y-1">
                    <li className="flex items-center gap-2">
                      <CheckCircle className={`w-4 h-4 ${password && password.length >= 6 ? 'text-green-600' : 'text-gray-400'}`} />
                      Be at least 6 characters long
                    </li>
                  </ul>
                </div>

                {/* Submit Button */}
                <Button
                  type="submit"
                  className="w-full h-12 text-base font-semibold bg-gradient-to-r from-primary to-purple-600 hover:from-primary/90 hover:to-purple-600/90 text-white cursor-pointer"
                  disabled={isLoading}
                >
                  {isLoading ? (
                    <>
                      <span className="mr-2">Resetting...</span>
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    </>
                  ) : (
                    <>
                      <Lock className="w-4 h-4 mr-2" />
                      Reset Password
                    </>
                  )}
                </Button>

                {/* Additional Links */}
                <div className="text-center space-y-2">
                  <div className="text-sm text-muted-foreground">
                    Remember your password?{' '}
                    <Link to="/login" className="text-primary hover:underline font-semibold cursor-pointer">
                      Sign in
                    </Link>
                  </div>
                </div>
              </form>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
