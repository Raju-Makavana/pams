import { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useForm } from 'react-hook-form';
import { petsApi } from '@/api/pets';
import { applicationsApi } from '@/api/applications';
import { useAuthStore } from '@/store/authStore';
import Header from '@/components/layout/Header';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select } from '@/components/ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import Swal from 'sweetalert2';

export default function PetDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const { isAuthenticated, user } = useAuthStore();
  const [showApplicationForm, setShowApplicationForm] = useState(false);

  const { data, isLoading } = useQuery({
    queryKey: ['pet', id],
    queryFn: () => petsApi.getPetDetails(id!),
    enabled: !!id,
  });

  const pet = data?.pet;

  const { register, handleSubmit, formState: { errors } } = useForm({
    mode: 'onBlur'
  });

  const applicationMutation = useMutation({
    mutationFn: (formData: any) => applicationsApi.createApplication(id!, formData),
    onSuccess: () => {
      setShowApplicationForm(false);
      Swal.fire({
        icon: 'success',
        title: 'Application Submitted!',
        text: 'Your adoption application has been submitted successfully. We will review it shortly.',
        confirmButtonText: 'View My Applications',
        showCancelButton: true,
        cancelButtonText: 'Close'
      }).then((result) => {
        if (result.isConfirmed) {
          navigate('/my-applications');
        }
      });
      queryClient.invalidateQueries({ queryKey: ['my-applications'] });
    },
    onError: (error: any) => {
      Swal.fire({
        icon: 'error',
        title: 'Application Failed',
        text: error.response?.data?.message || 'Failed to submit application. Please try again.',
        confirmButtonText: 'OK'
      });
    },
  });

  const onSubmit = (data: any) => {
    // Prepare application data
    const applicationData = {
      applicantName: user?.name || data.applicantName,
      email: user?.email || data.email,
      phone: data.phone,
      occupation: data.occupation || '',
      homeType: data.homeType,
      hasOtherPets: data.hasOtherPets || false,
      otherPetsDetails: data.otherPetsDetails || '',
      hasExperience: data.hasExperience || false,
      experienceDetails: data.experienceDetails || '',
      hasYard: data.hasYard || false,
      reasonForAdoption: data.reasonForAdoption,
      address: {
        street: data.street || '',
        city: data.city || '',
        state: data.state || '',
        zipCode: data.zipCode || '',
        country: data.country || ''
      }
    };

    applicationMutation.mutate(applicationData);
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <div className="container mx-auto px-4 py-8 text-center">
          <p className="text-muted-foreground">Loading...</p>
        </div>
      </div>
    );
  }

  if (!pet) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <div className="container mx-auto px-4 py-8 text-center">
          <p className="text-lg text-muted-foreground">Pet not found</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <div className="container mx-auto px-4 py-8">
        <div className="grid md:grid-cols-2 gap-8">
          {/* Pet Images */}
          <div>
            <div className="aspect-square bg-gradient-to-br from-blue-100 to-purple-100 dark:from-gray-700 dark:to-gray-800 rounded-lg overflow-hidden">
              {pet.photos && pet.photos.length > 0 ? (
                <img src={pet.photos[0]} alt={pet.name} className="w-full h-full object-cover" />
              ) : (
                <div className="w-full h-full flex items-center justify-center">
                  <span className="text-9xl">🐾</span>
                </div>
              )}
            </div>
          </div>

          {/* Pet Information */}
          <div>
            <div className="flex justify-between items-start mb-4">
              <h1 className="text-4xl font-bold">{pet.name}</h1>
              <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                pet.status === 'Available' ? 'bg-green-100 text-green-800' :
                pet.status === 'Pending' ? 'bg-yellow-100 text-yellow-800' :
                'bg-gray-100 text-gray-800'
              }`}>
                {pet.status}
              </span>
            </div>

            <div className="space-y-4 mb-6">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-muted-foreground">Species</p>
                  <p className="font-medium">{pet.species}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Breed</p>
                  <p className="font-medium">{pet.breed}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Age</p>
                  <p className="font-medium">{pet.age} {pet.age === 1 ? 'year' : 'years'}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Gender</p>
                  <p className="font-medium">{pet.gender}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Size</p>
                  <p className="font-medium">{pet.size}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Color</p>
                  <p className="font-medium">{pet.color || 'Not specified'}</p>
                </div>
              </div>

              <div>
                <p className="text-sm text-muted-foreground mb-2">Health Status</p>
                <div className="flex gap-4">
                  <span className={`px-2 py-1 rounded text-sm ${pet.vaccinated ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'}`}>
                    {pet.vaccinated ? '✓ Vaccinated' : '✗ Not Vaccinated'}
                  </span>
                  <span className={`px-2 py-1 rounded text-sm ${pet.neutered ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'}`}>
                    {pet.neutered ? '✓ Neutered' : '✗ Not Neutered'}
                  </span>
                </div>
              </div>

              <div>
                <p className="text-sm text-muted-foreground mb-2">Description</p>
                <p className="text-foreground">{pet.description}</p>
              </div>

              {pet.medicalHistory && (
                <div>
                  <p className="text-sm text-muted-foreground mb-2">Medical History</p>
                  <p className="text-foreground">{pet.medicalHistory}</p>
                </div>
              )}
            </div>

            {pet.status === 'Available' && (
              <Button
                className="w-full bg-gradient-to-r from-primary to-purple-600 hover:from-primary/90 hover:to-purple-600/90 text-white font-semibold cursor-pointer"
                size="lg"
                onClick={() => {
                  if (!isAuthenticated) {
                    Swal.fire({
                      icon: 'info',
                      title: 'Login Required',
                      text: 'Please login to apply for adoption',
                      confirmButtonText: 'Go to Login',
                      showCancelButton: true,
                      cancelButtonText: 'Cancel'
                    }).then((result) => {
                      if (result.isConfirmed) {
                        navigate('/login');
                      }
                    });
                  } else {
                    setShowApplicationForm(true);
                  }
                }}
              >
                Apply to Adopt
              </Button>
            )}
          </div>
        </div>

        {/* Application Form Dialog */}
        <Dialog open={showApplicationForm} onOpenChange={setShowApplicationForm}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Adoption Application for {pet.name}</DialogTitle>
              <DialogDescription>
                Please fill out this form to apply for adoption. We'll review your application and get back to you shortly.
              </DialogDescription>
            </DialogHeader>
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 mt-4">
              <div className="grid md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="applicantName" className="cursor-default">Full Name *</Label>
                  <Input
                    id="applicantName"
                    defaultValue={user?.name}
                    className="cursor-text"
                    {...register('applicantName', {
                      required: 'Name is required',
                      minLength: {
                        value: 2,
                        message: 'Name must be at least 2 characters'
                      }
                    })}
                  />
                  {errors.applicantName && (
                    <p className="text-sm text-red-500 flex items-center gap-1">
                      <span>⚠</span> {errors.applicantName.message as string}
                    </p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="email" className="cursor-default">Email *</Label>
                  <Input
                    id="email"
                    type="email"
                    defaultValue={user?.email}
                    className="cursor-text"
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
                      <span>⚠</span> {errors.email.message as string}
                    </p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="phone" className="cursor-default">Phone *</Label>
                  <Input
                    id="phone"
                    className="cursor-text"
                    {...register('phone', {
                      required: 'Phone is required',
                      pattern: {
                        value: /^[0-9\s\-\+\(\)]+$/,
                        message: 'Please enter a valid phone number'
                      }
                    })}
                  />
                  {errors.phone && (
                    <p className="text-sm text-red-500 flex items-center gap-1">
                      <span>⚠</span> {errors.phone.message as string}
                    </p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="occupation" className="cursor-default">Occupation</Label>
                  <Input id="occupation" className="cursor-text" {...register('occupation')} />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="homeType" className="cursor-default">Home Type *</Label>
                  <Select
                    id="homeType"
                    className="cursor-pointer"
                    {...register('homeType', { required: 'Home type is required' })}
                  >
                    <option value="">Select</option>
                    <option value="House">House</option>
                    <option value="Apartment">Apartment</option>
                    <option value="Condo">Condo</option>
                    <option value="Other">Other</option>
                  </Select>
                  {errors.homeType && (
                    <p className="text-sm text-red-500 flex items-center gap-1">
                      <span>⚠</span> {errors.homeType.message as string}
                    </p>
                  )}
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="reasonForAdoption" className="cursor-default">Why do you want to adopt {pet.name}? *</Label>
                <textarea
                  id="reasonForAdoption"
                  rows={4}
                  className="flex w-full rounded-md border border-input bg-transparent px-3 py-2 text-sm shadow-sm focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring cursor-text"
                  {...register('reasonForAdoption', {
                    required: 'This field is required',
                    minLength: {
                      value: 10,
                      message: 'Please provide at least 10 characters'
                    }
                  })}
                />
                {errors.reasonForAdoption && (
                  <p className="text-sm text-red-500 flex items-center gap-1">
                    <span>⚠</span> {errors.reasonForAdoption.message as string}
                  </p>
                )}
              </div>

              <div className="flex gap-4 justify-end pt-4 border-t">
                <Button type="button" variant="outline" onClick={() => setShowApplicationForm(false)} className="cursor-pointer">
                  Cancel
                </Button>
                <Button type="submit" disabled={applicationMutation.isPending} className="bg-gradient-to-r from-primary to-purple-600 hover:from-primary/90 hover:to-purple-600/90 text-white font-semibold cursor-pointer">
                  {applicationMutation.isPending ? 'Submitting...' : 'Submit Application'}
                </Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
}
