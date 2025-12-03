import { useQuery } from '@tanstack/react-query';
import { useAuthStore } from '@/store/authStore';
import { applicationsApi } from '@/api/applications';
import Header from '@/components/layout/Header';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';
import { PawPrint, FileText, CheckCircle, XCircle, Clock, Heart, TrendingUp } from 'lucide-react';

export default function Dashboard() {
  const { user } = useAuthStore();

  const { data: applicationsData, isLoading } = useQuery({
    queryKey: ['my-applications'],
    queryFn: applicationsApi.getMyApplications,
  });

  const applications = applicationsData?.applications || [];

  const stats = {
    totalApplications: applications.length,
    pending: applications.filter((app: any) => app.status === 'Pending').length,
    approved: applications.filter((app: any) => app.status === 'Approved').length,
    rejected: applications.filter((app: any) => app.status === 'Rejected').length,
  };

  const statsCards = [
    {
      title: 'Total Applications',
      value: stats.totalApplications,
      icon: FileText,
      color: 'bg-blue-500',
      description: 'All your applications',
      trend: '+0%'
    },
    {
      title: 'Pending',
      value: stats.pending,
      icon: Clock,
      color: 'bg-yellow-500',
      description: 'Awaiting review',
      trend: ''
    },
    {
      title: 'Approved',
      value: stats.approved,
      icon: CheckCircle,
      color: 'bg-green-500',
      description: 'Successfully approved',
      trend: ''
    },
    {
      title: 'Rejected',
      value: stats.rejected,
      icon: XCircle,
      color: 'bg-red-500',
      description: 'Not approved',
      trend: ''
    },
  ];

  return (
    <div className="min-h-screen bg-muted/30">
      <Header />

      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">Welcome back, {user?.name}!</h1>
          <p className="text-muted-foreground">Manage your pet adoption journey</p>
        </div>

        {/* Statistics Cards */}
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4 mb-8">
          {statsCards.map((stat, index) => {
            const Icon = stat.icon;
            return (
              <Card key={index} className="hover:shadow-lg transition-shadow">
                <CardHeader className="flex flex-row items-center justify-between pb-2">
                  <CardTitle className="text-sm font-medium text-muted-foreground">
                    {stat.title}
                  </CardTitle>
                  <div className={`${stat.color} w-10 h-10 rounded-lg flex items-center justify-center shadow-sm`}>
                    <Icon className="w-5 h-5 text-white" />
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold mb-1">{stat.value}</div>
                  <p className="text-xs text-muted-foreground">{stat.description}</p>
                  {stat.trend && (
                    <div className="flex items-center text-xs mt-2">
                      <TrendingUp className="w-3 h-3 mr-1 text-green-500" />
                      <span className="text-green-500 font-medium">{stat.trend}</span>
                      <span className="ml-1 text-muted-foreground">from last month</span>
                    </div>
                  )}
                </CardContent>
              </Card>
            );
          })}
        </div>

        {/* Quick Actions */}
        <div className="grid md:grid-cols-2 gap-6 mb-8">
          <Card className="hover:shadow-lg transition-shadow">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <PawPrint className="w-5 h-5 text-primary" />
                Browse Pets
              </CardTitle>
              <CardDescription>Find your perfect companion</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground mb-4">
                Explore our available pets and find the one that matches your lifestyle.
              </p>
              <Link to="/pets">
                <Button className="w-full">
                  <Heart className="w-4 h-4 mr-2" />
                  Browse Available Pets
                </Button>
              </Link>
            </CardContent>
          </Card>

          <Card className="hover:shadow-lg transition-shadow">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <FileText className="w-5 h-5 text-primary" />
                My Applications
              </CardTitle>
              <CardDescription>Track your adoption applications</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground mb-4">
                View and manage all your pet adoption applications in one place.
              </p>
              <Link to="/my-applications">
                <Button variant="outline" className="w-full">View Applications</Button>
              </Link>
            </CardContent>
          </Card>
        </div>

        {/* Recent Applications */}
        {isLoading ? (
          <Card className="hover:shadow-lg transition-shadow">
            <CardHeader>
              <CardTitle>Recent Applications</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">Loading...</p>
            </CardContent>
          </Card>
        ) : applications.length > 0 ? (
          <Card className="hover:shadow-lg transition-shadow">
            <CardHeader>
              <CardTitle>Recent Applications</CardTitle>
              <CardDescription>Your latest adoption applications</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {applications.slice(0, 3).map((application: any) => (
                  <div
                    key={application._id}
                    className="flex items-center justify-between p-4 border rounded-lg hover:bg-accent/50 transition-colors"
                  >
                    <div className="flex items-center gap-4">
                      {application.petId?.photos?.[0] ? (
                        <img
                          src={application.petId.photos[0]}
                          alt={application.petId?.name}
                          className="w-14 h-14 rounded-lg object-cover"
                        />
                      ) : (
                        <div className="w-14 h-14 bg-linear-to-br from-blue-100 to-purple-100 dark:from-blue-950 dark:to-purple-950 rounded-lg flex items-center justify-center">
                          <PawPrint className="w-6 h-6 text-primary" />
                        </div>
                      )}
                      <div>
                        <p className="font-semibold">{application.petId?.name}</p>
                        <p className="text-sm text-muted-foreground">
                          {application.petId?.species} • {application.petId?.breed}
                        </p>
                        <p className="text-xs text-muted-foreground mt-1">
                          Applied on {new Date(application.createdAt).toLocaleDateString()}
                        </p>
                      </div>
                    </div>
                    <span
                      className={`px-3 py-1 rounded-full text-sm font-medium whitespace-nowrap ${
                        application.status === 'Approved'
                          ? 'bg-green-100 text-green-800 dark:bg-green-950 dark:text-green-200'
                          : application.status === 'Rejected'
                          ? 'bg-red-100 text-red-800 dark:bg-red-950 dark:text-red-200'
                          : 'bg-yellow-100 text-yellow-800 dark:bg-yellow-950 dark:text-yellow-200'
                      }`}
                    >
                      {application.status}
                    </span>
                  </div>
                ))}
              </div>
              {applications.length > 3 && (
                <div className="mt-4 text-center">
                  <Link to="/my-applications">
                    <Button variant="outline" size="sm">
                      View All {applications.length} Applications
                    </Button>
                  </Link>
                </div>
              )}
            </CardContent>
          </Card>
        ) : (
          <Card className="hover:shadow-lg transition-shadow">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <PawPrint className="w-5 h-5 text-muted-foreground" />
                No Applications Yet
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground mb-4">
                You haven't applied for any pets yet. Start browsing to find your perfect companion!
              </p>
              <Link to="/pets">
                <Button>
                  <Heart className="w-4 h-4 mr-2" />
                  Browse Pets
                </Button>
              </Link>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}
