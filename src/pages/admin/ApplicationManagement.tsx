import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { applicationsApi } from '@/api/applications';
import AdminLayout from '@/components/layout/AdminLayout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import Swal from 'sweetalert2';

export default function ApplicationManagement() {
  const queryClient = useQueryClient();
  const [selectedApplication, setSelectedApplication] = useState<any>(null);
  const [adminNotes, setAdminNotes] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');

  const { data, isLoading } = useQuery({
    queryKey: ['admin-applications', statusFilter],
    queryFn: () => applicationsApi.getAllApplications(
      statusFilter !== 'all' ? { status: statusFilter } : {}
    ),
  });

  const applications = data?.applications || [];

  const updateStatusMutation = useMutation({
    mutationFn: ({ id, status, notes }: { id: string; status: string; notes?: string }) =>
      applicationsApi.updateApplicationStatus(id, { status, adminNotes: notes }),
    onSuccess: () => {
      Swal.fire({
        icon: 'success',
        title: 'Status Updated!',
        text: 'Application status has been updated successfully',
        confirmButtonText: 'OK',
        timer: 2000,
        timerProgressBar: true
      });
      queryClient.invalidateQueries({ queryKey: ['admin-applications'] });
      setSelectedApplication(null);
      setAdminNotes('');
    },
    onError: (error: any) => {
      Swal.fire({
        icon: 'error',
        title: 'Update Failed',
        text: error.response?.data?.message || 'Failed to update application',
        confirmButtonText: 'OK'
      });
    },
  });

  const handleApprove = (application: any) => {
    setSelectedApplication(application);
  };

  const handleReject = (application: any) => {
    setSelectedApplication(application);
  };

  const confirmApprove = () => {
    if (selectedApplication) {
      updateStatusMutation.mutate({
        id: selectedApplication._id,
        status: 'Approved',
        notes: adminNotes,
      });
    }
  };

  const confirmReject = () => {
    if (selectedApplication && adminNotes.trim()) {
      updateStatusMutation.mutate({
        id: selectedApplication._id,
        status: 'Rejected',
        notes: adminNotes,
      });
    } else {
      Swal.fire({
        icon: 'warning',
        title: 'Reason Required',
        text: 'Please provide a reason for rejection',
        confirmButtonText: 'OK'
      });
    }
  };

  const filteredApplications = applications;

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold">Application Management</h1>
          <p className="text-muted-foreground mt-1">Review and manage adoption applications</p>
        </div>

        {/* Filter */}
        <div className="mb-6 flex gap-2">
          <Button
            variant={statusFilter === 'all' ? 'default' : 'outline'}
            onClick={() => setStatusFilter('all')}
          >
            All
          </Button>
          <Button
            variant={statusFilter === 'Pending' ? 'default' : 'outline'}
            onClick={() => setStatusFilter('Pending')}
          >
            Pending
          </Button>
          <Button
            variant={statusFilter === 'Approved' ? 'default' : 'outline'}
            onClick={() => setStatusFilter('Approved')}
          >
            Approved
          </Button>
          <Button
            variant={statusFilter === 'Rejected' ? 'default' : 'outline'}
            onClick={() => setStatusFilter('Rejected')}
          >
            Rejected
          </Button>
        </div>

        {isLoading ? (
          <p className="text-center text-muted-foreground">Loading applications...</p>
        ) : filteredApplications.length === 0 ? (
          <Card>
            <CardContent className="py-8 text-center">
              <p className="text-muted-foreground">No applications found</p>
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-4">
            {filteredApplications.map((application: any) => (
              <Card key={application._id}>
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div className="flex gap-4">
                      {application.petId?.photos?.[0] ? (
                        <img
                          src={application.petId.photos[0]}
                          alt={application.petId?.name}
                          className="w-20 h-20 rounded-lg object-cover"
                        />
                      ) : (
                        <div className="w-20 h-20 bg-gradient-to-br from-blue-100 to-purple-100 rounded-lg flex items-center justify-center">
                          <span className="text-4xl">🐾</span>
                        </div>
                      )}
                      <div>
                        <CardTitle className="mb-1">{application.applicantName}</CardTitle>
                        <CardDescription>
                          Applied for <strong>{application.petId?.name}</strong> ({application.petId?.species})
                        </CardDescription>
                        <p className="text-sm text-muted-foreground mt-1">
                          {new Date(application.createdAt).toLocaleDateString('en-US', {
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
                  <div className="grid md:grid-cols-3 gap-4 mb-4">
                    <div>
                      <p className="text-sm text-muted-foreground">Email</p>
                      <p className="font-medium">{application.email}</p>
                    </div>
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
                    <p className="text-sm bg-accent/50 p-3 rounded">{application.reasonForAdoption}</p>
                  </div>

                  {application.adminNotes && (
                    <div className="mb-4">
                      <p className="text-sm text-muted-foreground mb-2">Admin Notes</p>
                      <p className="text-sm bg-accent/50 p-3 rounded">{application.adminNotes}</p>
                    </div>
                  )}

                  {application.status === 'Pending' && (
                    <div className="flex gap-2">
                      <Button
                        variant="default"
                        size="sm"
                        onClick={() => handleApprove(application)}
                      >
                        Approve
                      </Button>
                      <Button
                        variant="destructive"
                        size="sm"
                        onClick={() => handleReject(application)}
                      >
                        Reject
                      </Button>
                    </div>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>
        )}

        {/* Review Modal */}
        {selectedApplication && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
            <Card className="max-w-md w-full">
              <CardHeader>
                <CardTitle>
                  {selectedApplication.status === 'Pending' ? 'Review Application' : 'Application Decision'}
                </CardTitle>
                <CardDescription>
                  Application from {selectedApplication.applicantName} for {selectedApplication.petId?.name}
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="adminNotes">
                    {selectedApplication.status === 'Pending' ? 'Notes (Optional for approval, Required for rejection)' : 'Admin Notes'}
                  </Label>
                  <textarea
                    id="adminNotes"
                    rows={4}
                    className="flex w-full rounded-md border border-input bg-transparent px-3 py-2 text-sm shadow-sm focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
                    value={adminNotes}
                    onChange={(e) => setAdminNotes(e.target.value)}
                    placeholder="Add notes about your decision..."
                  />
                </div>

                <div className="flex gap-2 justify-end">
                  <Button
                    variant="outline"
                    onClick={() => {
                      setSelectedApplication(null);
                      setAdminNotes('');
                    }}
                  >
                    Cancel
                  </Button>
                  <Button
                    variant="destructive"
                    onClick={confirmReject}
                    disabled={updateStatusMutation.isPending}
                  >
                    {updateStatusMutation.isPending ? 'Rejecting...' : 'Reject Application'}
                  </Button>
                  <Button
                    variant="default"
                    onClick={confirmApprove}
                    disabled={updateStatusMutation.isPending}
                  >
                    {updateStatusMutation.isPending ? 'Approving...' : 'Approve Application'}
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        )}
      </div>
    </AdminLayout>
  );
}
