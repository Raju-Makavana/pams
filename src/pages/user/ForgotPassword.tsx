import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import Swal from 'sweetalert2';
import { ArrowLeft, Mail, CheckCircle } from 'lucide-react';
import { authApi } from '@/api/auth';

interface ForgotPasswordForm {
  email: string;
}

export default function ForgotPassword() {
  const [isLoading, setIsLoading] = useState(false);
  const [emailSent, setEmailSent] = useState(false);

  const { register, handleSubmit, watch, formState: { errors } } = useForm<ForgotPasswordForm>({
    mode: 'onBlur'
  });

  const email = watch('email');

  const onSubmit = async (data: ForgotPasswordForm) => {
    setIsLoading(true);
    try {
      // Call forgot password API endpoint
      await authApi.forgotPassword(data.email);

      setEmailSent(true);
      Swal.fire({
        icon: 'success',
        title: 'Email Sent!',
        text: 'Password reset instructions have been sent to your email.',
        confirmButtonText: 'OK'
      });
    } catch (error: any) {
      Swal.fire({
        icon: 'error',
        title: 'Failed to Send Email',
        text: error.response?.data?.message || 'Failed to send reset email. Please try again.',
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
                {/* Lock Icon */}
                <rect x="70" y="90" width="60" height="40" rx="5" fill="white" opacity="0.9"/>
                <path d="M80 90V75C80 63.954 88.954 55 100 55C111.046 55 120 63.954 120 75V90" stroke="white" strokeWidth="6" strokeLinecap="round" opacity="0.9"/>
                <circle cx="100" cy="110" r="6" fill="#4F46E5"/>
              </svg>
            </div>
            <h2 className="text-white text-3xl font-bold mb-4">Forgot Password?</h2>
            <p className="text-blue-100 text-lg">No worries! We'll send you reset instructions.</p>
          </div>
        </div>

        {/* Bottom Quote */}
        <div className="relative z-10">
          <blockquote className="text-white/90 text-lg italic">
            "Security is not a product, but a process."
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

          {!emailSent ? (
            <Card>
              <CardHeader>
                <CardTitle className="text-2xl">Forgot Password</CardTitle>
                <CardDescription>
                  Enter your email address and we'll send you instructions to reset your password
                </CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                  {/* Email Field */}
                  <div className="space-y-2">
                    <Label htmlFor="email" className="text-sm font-medium cursor-default">
                      Email Address *
                    </Label>
                    <div className="relative">
                      <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                      <Input
                        id="email"
                        type="email"
                        placeholder="example@domain.com"
                        className="h-12 pl-10 cursor-text"
                        {...register('email', {
                          required: 'Email is required',
                          pattern: {
                            value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                            message: 'Please enter a valid email address'
                          }
                        })}
                      />
                    </div>
                    {errors.email && (
                      <p className="text-sm text-red-500 flex items-center gap-1">
                        <span>⚠</span> {errors.email.message}
                      </p>
                    )}
                  </div>

                  {/* Submit Button */}
                  <Button type="submit" className="w-full h-12 text-base font-semibold bg-gradient-to-r from-primary to-purple-600 hover:from-primary/90 hover:to-purple-600/90 text-white cursor-pointer" disabled={isLoading}>
                    {isLoading ? (
                      <>
                        <span className="mr-2">Sending...</span>
                        <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                      </>
                    ) : (
                      <>
                        <Mail className="w-4 h-4 mr-2" />
                        Send Reset Instructions
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
                    <div className="text-sm text-muted-foreground">
                      Don't have an account?{' '}
                      <Link to="/register" className="text-primary hover:underline font-semibold cursor-pointer">
                        Register
                      </Link>
                    </div>
                  </div>
                </form>
              </CardContent>
            </Card>
          ) : (
            <Card>
              <CardHeader className="text-center">
                <div className="mx-auto w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mb-4">
                  <CheckCircle className="w-8 h-8 text-green-600" />
                </div>
                <CardTitle className="text-2xl">Check Your Email</CardTitle>
                <CardDescription>
                  We've sent password reset instructions to
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="text-center">
                  <p className="font-semibold text-lg">{email}</p>
                </div>

                <div className="bg-muted p-4 rounded-lg">
                  <p className="text-sm text-muted-foreground text-center">
                    Didn't receive the email? Check your spam folder or{' '}
                    <button
                      onClick={() => setEmailSent(false)}
                      className="text-primary hover:underline font-semibold cursor-pointer"
                    >
                      try another email address
                    </button>
                  </p>
                </div>

                <Link to="/login" className="block w-full">
                  <Button className="w-full h-12 bg-gradient-to-r from-primary to-purple-600 hover:from-primary/90 hover:to-purple-600/90 cursor-pointer">
                    <ArrowLeft className="w-4 h-4 mr-2" />
                    Back to Login
                  </Button>
                </Link>

                <div className="text-center">
                  <p className="text-xs text-muted-foreground">
                    The reset link will expire in 30 minutes
                  </p>
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
}
