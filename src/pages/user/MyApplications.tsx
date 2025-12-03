import { useQuery } from '@tanstack/react-query';
import { applicationsApi } from '@/api/applications';
import Header from '@/components/layout/Header';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';

export default function MyApplications() {
  const { data, isLoading } = useQuery({
    queryKey: ['my-applications'],
    queryFn: applicationsApi.getMyApplications,
  });

  const applications = data?.applications || [];

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <div className="container mx-auto px-4 py-8 text-center">
          <p className="text-muted-foreground">Loading your applications...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Header />

      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">My Applications</h1>
          <p className="text-muted-foreground">Track all your pet adoption applications</p>
        </div>

        {applications.length === 0 ? (
          <Card>
            <CardHeader>
              <CardTitle>No Applications Yet</CardTitle>
              <CardDescription>You haven't applied for any pets yet</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground mb-4">
                Browse our available pets and submit an application to start your adoption journey.
              </p>
              <Link to="/pets">
                <Button>Browse Available Pets</Button>
              </Link>
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-6">
            {applications.map((application: any) => (
              <Card key={application._id}>
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div className="flex gap-4">
                      {application.petId?.photos?.[0] ? (
                        <img
                          src={application.petId.photos[0]}
                          alt={application.petId?.name}
                          className="w-24 h-24 rounded-lg object-cover"
                        />
                      ) : (
                        <div className="w-24 h-24 bg-gradient-to-br from-blue-100 to-purple-100 rounded-lg flex items-center justify-center">
                          <span className="text-5xl">🐾</span>
                        </div>
                      )}
                      <div>
                        <CardTitle className="mb-2">{application.petId?.name}</CardTitle>
                        <CardDescription>
                          {application.petId?.species} • {application.petId?.breed} • {application.petId?.age} {application.petId?.age === 1 ? 'year' : 'years'}
                        </CardDescription>
                        <p className="text-sm text-muted-foreground mt-2">
                          Applied on {new Date(application.createdAt).toLocaleDateString('en-US', {
                            year: 'numeric',
                            month: 'long',
                            day: 'numeric'
                          })}
                        </p>
                      </div>
                    </div>
                    <span
                      className={`px-3 py-1 rounded-full text-sm font-medium ${
                        application.status === 'Approved'
                          ? 'bg-green-100 text-green-800'
                          : application.status === 'Rejected'
                          ? 'bg-red-100 text-red-800'
                          : 'bg-yellow-100 text-yellow-800'
                      }`}
                    >
                      {application.status}
                    </span>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="grid md:grid-cols-2 gap-4 mb-4">
                    <div>
                      <p className="text-sm text-muted-foreground">Phone</p>
                      <p className="font-medium">{application.phone}</p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Home Type</p>
                      <p className="font-medium">{application.homeType}</p>
                    </div>
                    {application.occupation && (
                      <div>
                        <p className="text-sm text-muted-foreground">Occupation</p>
                        <p className="font-medium">{application.occupation}</p>
                      </div>
                    )}
                  </div>

                  <div className="mb-4">
                    <p className="text-sm text-muted-foreground mb-2">Reason for Adoption</p>
                    <p className="text-sm">{application.reasonForAdoption}</p>
                  </div>

                  {application.status === 'Approved' && application.adminNotes && (
                    <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                      <p className="text-sm font-medium text-green-900 mb-1">Admin Notes</p>
                      <p className="text-sm text-green-800">{application.adminNotes}</p>
                    </div>
                  )}

                  {application.status === 'Rejected' && application.adminNotes && (
                    <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                      <p className="text-sm font-medium text-red-900 mb-1">Rejection Reason</p>
                      <p className="text-sm text-red-800">{application.adminNotes}</p>
                    </div>
                  )}

                  {application.status === 'Pending' && (
                    <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                      <p className="text-sm text-yellow-800">
                        Your application is being reviewed. We'll notify you once a decision has been made.
                      </p>
                    </div>
                  )}

                  <div className="mt-4 flex gap-2">
                    <Link to={`/pets/${application.petId?._id}`}>
                      <Button variant="outline" size="sm">View Pet Details</Button>
                    </Link>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
