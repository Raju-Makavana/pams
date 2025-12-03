import { Link, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Heart, Shield, Users, PawPrint, ArrowRight, LogOut, LayoutDashboard } from 'lucide-react';
import { useAuthStore } from '@/store/authStore';

export default function Home() {
  const { user, logout } = useAuthStore();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Navigation */}
      <nav className="border-b bg-background/95 backdrop-blur supports-backdrop-filter:bg-background/60 sticky top-0 z-50">
        <div className="container mx-auto px-4 h-16 flex items-center justify-between">
          <Link to="/" className="flex items-center gap-2">
            <PawPrint className="w-8 h-8 text-primary" />
            <span className="text-xl font-bold">PAMS</span>
          </Link>
          <div className="flex items-center gap-4">
            <Link to="/pets">
              <Button variant="ghost">Browse Pets</Button>
            </Link>
            {user ? (
              <>
                <Link to={user.role_id?.name === 'admin' ? '/admin' : '/dashboard'}>
                  <Button variant="ghost">
                    <LayoutDashboard className="w-4 h-4 mr-2" />
                    Dashboard
                  </Button>
                </Link>
                <Button variant="ghost" onClick={handleLogout}>
                  <LogOut className="w-4 h-4 mr-2" />
                  Logout
                </Button>
              </>
            ) : (
              <>
                <Link to="/login">
                  <Button variant="ghost">Login</Button>
                </Link>
                <Link to="/register">
                  <Button>Get Started</Button>
                </Link>
              </>
            )}
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative overflow-hidden bg-linear-to-br from-blue-600 via-indigo-600 to-purple-700 text-white">
        {/* Background Pattern */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-0 right-0 w-96 h-96 bg-white rounded-full translate-x-1/2 -translate-y-1/2"></div>
          <div className="absolute bottom-0 left-0 w-96 h-96 bg-white rounded-full -translate-x-1/2 translate-y-1/2"></div>
        </div>

        <div className="container mx-auto px-4 py-20 md:py-32 relative z-10">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            {/* Left Side - Text */}
            <div>
              <h1 className="text-4xl md:text-6xl font-bold mb-6 leading-tight">
                Find Your Perfect
                <span className="block text-blue-200">Companion</span>
              </h1>
              <p className="text-xl text-blue-100 mb-8 leading-relaxed">
                Give a loving home to pets in need. Browse our available pets and start your adoption journey today.
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <Link to="/pets">
                  <Button size="lg" variant="secondary" className="w-full sm:w-auto text-lg px-8 h-14">
                    Browse Pets
                    <ArrowRight className="ml-2 w-5 h-5" />
                  </Button>
                </Link>
                <Link to="/register">
                  <Button
                    size="lg"
                    variant="outline"
                    className="w-full sm:w-auto text-lg px-8 h-14 border-white text-white hover:bg-white hover:text-primary"
                  >
                    Get Started
                  </Button>
                </Link>
              </div>

              {/* Stats */}
              <div className="grid grid-cols-3 gap-6 mt-12 pt-12 border-t border-white/20">
                <div>
                  <div className="text-3xl font-bold mb-1">500+</div>
                  <div className="text-sm text-blue-100">Pets Adopted</div>
                </div>
                <div>
                  <div className="text-3xl font-bold mb-1">1000+</div>
                  <div className="text-sm text-blue-100">Happy Families</div>
                </div>
                <div>
                  <div className="text-3xl font-bold mb-1">50+</div>
                  <div className="text-sm text-blue-100">Available Now</div>
                </div>
              </div>
            </div>

            {/* Right Side - Illustration */}
            <div className="hidden lg:block">
              <div className="relative">
                <svg className="w-full h-auto max-w-lg mx-auto" viewBox="0 0 400 400" fill="none" xmlns="http://www.w3.org/2000/svg">
                  {/* Background Circle */}
                  <circle cx="200" cy="200" r="180" fill="white" opacity="0.1"/>

                  {/* Dog */}
                  <ellipse cx="150" cy="200" rx="60" ry="80" fill="white" opacity="0.95"/>
                  <circle cx="135" cy="180" r="8" fill="#4F46E5"/>
                  <circle cx="165" cy="180" r="8" fill="#4F46E5"/>
                  <path d="M130 210C130 210 140 225 150 225C160 225 170 210 170 210" stroke="#4F46E5" strokeWidth="4" strokeLinecap="round"/>
                  <ellipse cx="115" cy="150" rx="18" ry="35" fill="white" opacity="0.95"/>
                  <ellipse cx="185" cy="150" rx="18" ry="35" fill="white" opacity="0.95"/>

                  {/* Cat */}
                  <ellipse cx="250" cy="200" rx="60" ry="80" fill="white" opacity="0.95"/>
                  <circle cx="235" cy="180" r="8" fill="#4F46E5"/>
                  <circle cx="265" cy="180" r="8" fill="#4F46E5"/>
                  <path d="M230 210C230 210 240 225 250 225C260 225 270 210 270 210" stroke="#4F46E5" strokeWidth="4" strokeLinecap="round"/>
                  <path d="M215 140 L225 170 L235 140" stroke="white" strokeWidth="5" fill="white" opacity="0.95"/>
                  <path d="M265 140 L275 170 L285 140" stroke="white" strokeWidth="5" fill="white" opacity="0.95"/>

                  {/* Hearts */}
                  <path d="M200 100 C200 90 210 80 220 90 C230 80 240 90 240 100 C240 120 220 130 220 130 C220 130 200 120 200 100Z" fill="white" opacity="0.9"/>
                  <path d="M160 300 C160 290 170 280 180 290 C190 280 200 290 200 300 C200 320 180 330 180 330 C180 330 160 320 160 300Z" fill="white" opacity="0.8"/>
                  <path d="M250 310 C250 300 260 290 270 300 C280 290 290 300 290 310 C290 330 270 340 270 340 C270 340 250 330 250 310Z" fill="white" opacity="0.7"/>
                </svg>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 px-4 bg-muted/30">
        <div className="container mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold mb-4">Why Choose PAMS?</h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              We make pet adoption simple, safe, and rewarding for everyone involved
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <Card className="border-2 hover:border-primary transition-colors">
              <CardHeader>
                <div className="w-14 h-14 bg-blue-100 dark:bg-blue-900 rounded-xl flex items-center justify-center mb-4">
                  <Heart className="w-7 h-7 text-blue-600 dark:text-blue-400" />
                </div>
                <CardTitle className="text-2xl">Easy Adoption Process</CardTitle>
                <CardDescription className="text-base">
                  Simple and straightforward application process to help you find your new family member quickly and easily.
                </CardDescription>
              </CardHeader>
            </Card>

            <Card className="border-2 hover:border-primary transition-colors">
              <CardHeader>
                <div className="w-14 h-14 bg-green-100 dark:bg-green-900 rounded-xl flex items-center justify-center mb-4">
                  <Shield className="w-7 h-7 text-green-600 dark:text-green-400" />
                </div>
                <CardTitle className="text-2xl">Verified Pets</CardTitle>
                <CardDescription className="text-base">
                  All pets are vaccinated, health-checked, and ready for their forever homes with complete medical records.
                </CardDescription>
              </CardHeader>
            </Card>

            <Card className="border-2 hover:border-primary transition-colors">
              <CardHeader>
                <div className="w-14 h-14 bg-purple-100 dark:bg-purple-900 rounded-xl flex items-center justify-center mb-4">
                  <Users className="w-7 h-7 text-purple-600 dark:text-purple-400" />
                </div>
                <CardTitle className="text-2xl">Ongoing Support</CardTitle>
                <CardDescription className="text-base">
                  Get guidance and support throughout the adoption process and beyond from our dedicated team.
                </CardDescription>
              </CardHeader>
            </Card>
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="py-20 px-4">
        <div className="container mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold mb-4">How It Works</h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Four simple steps to find your perfect companion
            </p>
          </div>

          <div className="grid md:grid-cols-4 gap-8">
            {[
              { number: '01', title: 'Browse Pets', desc: 'Explore our available pets and find your perfect match' },
              { number: '02', title: 'Apply', desc: 'Fill out a simple application form for your chosen pet' },
              { number: '03', title: 'Get Approved', desc: 'Our team reviews your application quickly' },
              { number: '04', title: 'Adopt', desc: 'Meet your new friend and complete the adoption' }
            ].map((step, index) => (
              <div key={index} className="text-center">
                <div className="w-16 h-16 bg-primary text-primary-foreground rounded-full flex items-center justify-center text-2xl font-bold mx-auto mb-4">
                  {step.number}
                </div>
                <h3 className="text-xl font-bold mb-2">{step.title}</h3>
                <p className="text-muted-foreground">{step.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4 bg-linear-to-r from-purple-600 via-pink-600 to-rose-700 text-white">
        <div className="container mx-auto text-center">
          <h2 className="text-4xl md:text-5xl font-bold mb-6">Ready to Make a Difference?</h2>
          <p className="text-xl text-purple-100 mb-8 max-w-2xl mx-auto">
            Start your pet adoption journey today and give a loving animal the home they deserve.
          </p>
          <Link to="/pets">
            <Button size="lg" variant="secondary" className="text-lg px-10 h-14">
              View Available Pets
              <ArrowRight className="ml-2 w-5 h-5" />
            </Button>
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t bg-muted/30 py-12 px-4">
        <div className="container mx-auto">
          <div className="grid md:grid-cols-4 gap-8 mb-8">
            <div>
              <div className="flex items-center gap-2 mb-4">
                <PawPrint className="w-6 h-6 text-primary" />
                <span className="text-lg font-bold">PAMS</span>
              </div>
              <p className="text-sm text-muted-foreground">
                Making pet adoption simple and rewarding for everyone.
              </p>
            </div>
            <div>
              <h3 className="font-semibold mb-4">Quick Links</h3>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li><Link to="/pets" className="hover:text-primary">Browse Pets</Link></li>
                <li><Link to="/register" className="hover:text-primary">Register</Link></li>
                <li><Link to="/login" className="hover:text-primary">Login</Link></li>
              </ul>
            </div>
            <div>
              <h3 className="font-semibold mb-4">Support</h3>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li><a href="#" className="hover:text-primary">FAQ</a></li>
                <li><a href="#" className="hover:text-primary">Contact Us</a></li>
                <li><a href="#" className="hover:text-primary">Help Center</a></li>
              </ul>
            </div>
            <div>
              <h3 className="font-semibold mb-4">Legal</h3>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li><a href="#" className="hover:text-primary">Privacy Policy</a></li>
                <li><a href="#" className="hover:text-primary">Terms of Service</a></li>
              </ul>
            </div>
          </div>
          <div className="text-center pt-8 border-t text-sm text-muted-foreground">
            <p>&copy; 2024 Pet Adoption Management System. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
