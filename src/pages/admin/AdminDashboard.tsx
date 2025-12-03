import { useQuery } from '@tanstack/react-query';
import { petsApi } from '@/api/pets';
import { applicationsApi } from '@/api/applications';
import AdminLayout from '@/components/layout/AdminLayout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';
import { PawPrint, FileText, CheckCircle, Clock, TrendingUp, AlertCircle } from 'lucide-react';

export default function AdminDashboard() {
  const { data: petsData } = useQuery({
    queryKey: ['admin-pets'],
    queryFn: () => petsApi.getAllPets({}),
  });

  const { data: applicationsData } = useQuery({
    queryKey: ['admin-applications'],
    queryFn: applicationsApi.getAllApplications,
  });

  const pets = petsData?.pets || [];
  const applications = applicationsData?.applications || [];

  const stats = {
    totalPets: pets.length,
    availablePets: pets.filter((pet: any) => pet.status === 'Available').length,
    adoptedPets: pets.filter((pet: any) => pet.status === 'Adopted').length,
    pendingPets: pets.filter((pet: any) => pet.status === 'Pending').length,
    totalApplications: applications.length,
    pendingApplications: applications.filter((app: any) => app.status === 'Pending').length,
    approvedApplications: applications.filter((app: any) => app.status === 'Approved').length,
    rejectedApplications: applications.filter((app: any) => app.status === 'Rejected').length,
  };

  const statsCards = [
    {
      title: 'Total Pets',
      value: stats.totalPets,
      change: '+12%',
      icon: PawPrint,
      color: 'bg-blue-500',
      description: `${stats.availablePets} available`
    },
    {
      title: 'Available Pets',
      value: stats.availablePets,
      change: '+8%',
      icon: CheckCircle,
      color: 'bg-green-500',
      description: 'Ready for adoption'
    },
    {
      title: 'Total Applications',
      value: stats.totalApplications,
      change: '+23%',
      icon: FileText,
      color: 'bg-purple-500',
      description: `${stats.approvedApplications} approved`
    },
    {
      title: 'Pending Reviews',
      value: stats.pendingApplications,
      change: '+5',
      icon: Clock,
      color: 'bg-orange-500',
      description: 'Require action'
    },
  ];

  const recentApplications = applications.slice(0, 5);

  return (
    <AdminLayout>
      <div className="space-y-6">
        {/* Header */}
        <div>
          <h1 className="text-3xl font-bold">Dashboard</h1>
          <p className="text-muted-foreground mt-1">
            Welcome back! Here's what's happening with your pet adoption platform.
          </p>
        </div>

        {/* Stats Grid */}
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
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
                  <div className="flex items-center text-xs mt-2">
                    <TrendingUp className="w-3 h-3 mr-1 text-green-500" />
                    <span className="text-green-500 font-medium">{stat.change}</span>
                    <span className="ml-1 text-muted-foreground">from last month</span>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>

        {/* Quick Actions & Pet Status */}
        <div className="grid gap-6 lg:grid-cols-2">
          {/* Quick Actions */}
          <div className="space-y-6">
            <Card className="hover:shadow-lg transition-shadow">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <PawPrint className="w-5 h-5 text-primary" />
                  Pet Management
                </CardTitle>
                <CardDescription>Add, edit, or remove pets from the system</CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground mb-4">
                  Manage the pet database, update information, and track adoption status.
                </p>
                <Link to="/admin/pets">
                  <Button className="w-full">Manage Pets</Button>
                </Link>
              </CardContent>
            </Card>

            <Card className="hover:shadow-lg transition-shadow">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <FileText className="w-5 h-5 text-primary" />
                  Application Reviews
                </CardTitle>
                <CardDescription>Review and process adoption applications</CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground mb-4">
                  Review pending applications and make adoption decisions.
                </p>
                <Link to="/admin/applications">
                  <Button variant="outline" className="w-full">Review Applications</Button>
                </Link>
              </CardContent>
            </Card>
          </div>

          {/* Pet Status Overview */}
          <Card className="hover:shadow-lg transition-shadow">
            <CardHeader>
              <CardTitle>Pet Status Overview</CardTitle>
              <CardDescription>Current status of all pets in the system</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-3">
                <div className="flex items-center justify-between p-3 border rounded-lg bg-green-50 dark:bg-green-950/20">
                  <div className="flex items-center gap-3">
                    <div className="w-3 h-3 rounded-full bg-green-500" />
                    <span className="font-medium">Available</span>
                  </div>
                  <span className="text-2xl font-bold">{stats.availablePets}</span>
                </div>

                <div className="flex items-center justify-between p-3 border rounded-lg bg-yellow-50 dark:bg-yellow-950/20">
                  <div className="flex items-center gap-3">
                    <div className="w-3 h-3 rounded-full bg-yellow-500" />
                    <span className="font-medium">Pending</span>
                  </div>
                  <span className="text-2xl font-bold">{stats.pendingPets}</span>
                </div>

                <div className="flex items-center justify-between p-3 border rounded-lg bg-gray-50 dark:bg-gray-950/20">
                  <div className="flex items-center gap-3">
                    <div className="w-3 h-3 rounded-full bg-gray-500" />
                    <span className="font-medium">Adopted</span>
                  </div>
                  <span className="text-2xl font-bold">{stats.adoptedPets}</span>
                </div>
              </div>

              <div className="pt-4 border-t">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">Adoption Rate</span>
                  <span className="font-bold text-green-600">
                    {stats.totalPets > 0 ? Math.round((stats.adoptedPets / stats.totalPets) * 100) : 0}%
                  </span>
                </div>
                <div className="mt-2 w-full bg-muted rounded-full h-2">
                  <div
                    className="bg-green-500 h-2 rounded-full transition-all"
                    style={{
                      width: `${stats.totalPets > 0 ? (stats.adoptedPets / stats.totalPets) * 100 : 0}%`
                    }}
                  />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Recent Applications */}
        <Card className="hover:shadow-lg transition-shadow">
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle>Recent Applications</CardTitle>
                <CardDescription>Latest adoption requests requiring review</CardDescription>
              </div>
              {stats.pendingApplications > 0 && (
                <div className="flex items-center gap-2 px-3 py-1 bg-orange-100 dark:bg-orange-950 text-orange-800 dark:text-orange-200 rounded-full">
                  <AlertCircle className="w-4 h-4" />
                  <span className="text-sm font-medium">{stats.pendingApplications} pending</span>
                </div>
              )}
            </div>
          </CardHeader>
          <CardContent>
            {recentApplications.length === 0 ? (
              <div className="text-center py-12">
                <FileText className="w-12 h-12 mx-auto text-muted-foreground/50 mb-3" />
                <p className="text-muted-foreground">No applications yet</p>
              </div>
            ) : (
              <div className="space-y-3">
                {recentApplications.map((application: any) => (
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
                        <p className="font-semibold">{application.applicantName}</p>
                        <p className="text-sm text-muted-foreground">
                          Applied for {application.petId?.name || 'Unknown Pet'}
                        </p>
                        <p className="text-xs text-muted-foreground mt-1">
                          {new Date(application.createdAt).toLocaleDateString()}
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
            )}
            {applications.length > 5 && (
              <div className="mt-4 text-center">
                <Link to="/admin/applications">
                  <Button variant="outline" size="sm">
                    View All {applications.length} Applications
                  </Button>
                </Link>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </AdminLayout>
  );
}
