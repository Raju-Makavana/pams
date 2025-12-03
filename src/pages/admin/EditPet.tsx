import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useForm } from 'react-hook-form';
import { petsApi } from '@/api/pets';
import AdminLayout from '@/components/layout/AdminLayout';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select } from '@/components/ui/select';
import { ImageGallery } from '@/components/ui/image-gallery';
import Swal from 'sweetalert2';
import { ImagePlus, ArrowLeft, Image as ImageIcon, Link as LinkIcon, Plus, X } from 'lucide-react';

interface PetForm {
  name: string;
  species: string;
  breed: string;
  age: number;
  gender: string;
  size: string;
  color: string;
  description: string;
  medicalHistory: string;
  vaccinated: boolean;
  neutered: boolean;
  status: string;
  location: string;
  photos: string[];
}

export default function EditPet() {
  const { id } = useParams();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [imageInputType, setImageInputType] = useState<'file' | 'url'>('file');
  const [selectedPhotos, setSelectedPhotos] = useState<FileList | null>(null);
  const [imageUrls, setImageUrls] = useState<string[]>([]);
  const [currentUrl, setCurrentUrl] = useState('');

  const { register, handleSubmit, formState: { errors }, reset } = useForm<PetForm>();

  // Fetch pet details
  const { data: petData, isLoading } = useQuery({
    queryKey: ['pet', id],
    queryFn: () => petsApi.getPetDetails(id!),
    enabled: !!id,
  });

  const pet = petData?.pet;

  // Set form values when pet data is loaded
  useEffect(() => {
    if (pet) {
      reset({
        name: pet.name,
        species: pet.species,
        breed: pet.breed,
        age: pet.age,
        gender: pet.gender,
        size: pet.size,
        color: pet.color,
        description: pet.description,
        medicalHistory: pet.medicalHistory,
        vaccinated: pet.vaccinated,
        neutered: pet.neutered,
        status: pet.status,
        location: pet.location,
        photos: pet.photos || [],
      });
    }
  }, [pet, reset]);

  // Update pet mutation
  const updateMutation = useMutation({
    mutationFn: (data: FormData) => petsApi.updatePet(id!, data),
    onSuccess: () => {
      Swal.fire({
        icon: 'success',
        title: 'Pet Updated!',
        text: 'Pet information has been updated successfully',
        confirmButtonText: 'OK',
        timer: 2000,
        timerProgressBar: true
      });
      queryClient.invalidateQueries({ queryKey: ['admin-pets'] });
      queryClient.invalidateQueries({ queryKey: ['pet', id] });
      navigate('/admin/pets');
    },
    onError: (error: any) => {
      Swal.fire({
        icon: 'error',
        title: 'Update Failed',
        text: error.response?.data?.message || 'Failed to update pet',
        confirmButtonText: 'OK'
      });
    },
  });

  const addImageUrl = () => {
    if (currentUrl.trim()) {
      setImageUrls([...imageUrls, currentUrl.trim()]);
      setCurrentUrl('');
    }
  };

  const removeImageUrl = (index: number) => {
    setImageUrls(imageUrls.filter((_, i) => i !== index));
  };

  const onSubmit = (data: PetForm) => {
    const formData = new FormData();

    // Append all text fields
    Object.keys(data).forEach((key) => {
      if (key !== 'photos' && key !== 'vaccinated' && key !== 'neutered') {
        formData.append(key, String(data[key as keyof PetForm]));
      }
    });

    // Append boolean fields
    formData.append('vaccinated', String(data.vaccinated));
    formData.append('neutered', String(data.neutered));

    // Append existing photos as JSON
    if (pet?.photos && pet.photos.length > 0) {
      formData.append('photos', JSON.stringify(pet.photos));
    }

    // Append new photo files if selected
    if (imageInputType === 'file' && selectedPhotos) {
      Array.from(selectedPhotos).forEach((file) => {
        formData.append('photos', file);
      });
    }

    // Append new image URLs if selected
    if (imageInputType === 'url' && imageUrls.length > 0) {
      imageUrls.forEach(url => {
        formData.append('photoUrls', url);
      });
    }

    updateMutation.mutate(formData);
  };

  const handleCancel = () => {
    navigate('/admin/pets');
  };

  if (isLoading) {
    return (
      <AdminLayout>
        <div className="flex items-center justify-center min-h-[400px]">
          <p className="text-muted-foreground">Loading pet details...</p>
        </div>
      </AdminLayout>
    );
  }

  if (!pet) {
    return (
      <AdminLayout>
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="text-center">
            <p className="text-lg text-muted-foreground mb-4">Pet not found</p>
            <Button onClick={() => navigate('/admin/pets')}>
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Pet Management
            </Button>
          </div>
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold">Edit Pet</h1>
            <p className="text-muted-foreground mt-1">Update pet information</p>
          </div>
          <Button variant="outline" onClick={handleCancel}>
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to List
          </Button>
        </div>

        <form onSubmit={handleSubmit(onSubmit)}>
          <Card>
            <CardHeader>
              <CardTitle>Pet Information</CardTitle>
              <CardDescription>Update the pet's details</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Current Photos */}
              {pet.photos && pet.photos.length > 0 && (
                <div className="space-y-2">
                  <Label>Current Photos</Label>
                  <ImageGallery images={pet.photos} alt={pet.name} />
                </div>
              )}

              {/* Basic Information */}
              <div className="grid md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="name">Pet Name *</Label>
                  <Input
                    id="name"
                    {...register('name', { required: 'Name is required' })}
                  />
                  {errors.name && <p className="text-sm text-destructive">{errors.name.message}</p>}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="species">Species *</Label>
                  <Select
                    id="species"
                    {...register('species', { required: 'Species is required' })}
                  >
                    <option value="">Select Species</option>
                    <option value="Dog">Dog</option>
                    <option value="Cat">Cat</option>
                    <option value="Bird">Bird</option>
                    <option value="Rabbit">Rabbit</option>
                    <option value="Other">Other</option>
                  </Select>
                  {errors.species && <p className="text-sm text-destructive">{errors.species.message}</p>}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="breed">Breed *</Label>
                  <Input
                    id="breed"
                    {...register('breed', { required: 'Breed is required' })}
                  />
                  {errors.breed && <p className="text-sm text-destructive">{errors.breed.message}</p>}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="age">Age (years) *</Label>
                  <Input
                    id="age"
                    type="number"
                    min="0"
                    {...register('age', { required: 'Age is required', valueAsNumber: true })}
                  />
                  {errors.age && <p className="text-sm text-destructive">{errors.age.message}</p>}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="gender">Gender *</Label>
                  <Select
                    id="gender"
                    {...register('gender', { required: 'Gender is required' })}
                  >
                    <option value="">Select Gender</option>
                    <option value="Male">Male</option>
                    <option value="Female">Female</option>
                  </Select>
                  {errors.gender && <p className="text-sm text-destructive">{errors.gender.message}</p>}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="size">Size *</Label>
                  <Select
                    id="size"
                    {...register('size', { required: 'Size is required' })}
                  >
                    <option value="">Select Size</option>
                    <option value="Small">Small</option>
                    <option value="Medium">Medium</option>
                    <option value="Large">Large</option>
                  </Select>
                  {errors.size && <p className="text-sm text-destructive">{errors.size.message}</p>}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="color">Color</Label>
                  <Input id="color" {...register('color')} />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="location">Location</Label>
                  <Input id="location" placeholder="City, State" {...register('location')} />
                </div>
              </div>

              {/* Description */}
              <div className="space-y-2">
                <Label htmlFor="description">Description *</Label>
                <textarea
                  id="description"
                  rows={4}
                  className="flex w-full rounded-md border border-input bg-transparent px-3 py-2 text-sm shadow-sm focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
                  {...register('description', { required: 'Description is required' })}
                />
                {errors.description && <p className="text-sm text-destructive">{errors.description.message}</p>}
              </div>

              {/* Medical History */}
              <div className="space-y-2">
                <Label htmlFor="medicalHistory">Medical History</Label>
                <textarea
                  id="medicalHistory"
                  rows={3}
                  className="flex w-full rounded-md border border-input bg-transparent px-3 py-2 text-sm shadow-sm focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
                  {...register('medicalHistory')}
                />
              </div>

              {/* Health Status & Pet Status */}
              <div className="grid md:grid-cols-3 gap-4">
                <div className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    id="vaccinated"
                    className="h-4 w-4"
                    {...register('vaccinated')}
                  />
                  <Label htmlFor="vaccinated" className="font-normal cursor-pointer">
                    Vaccinated
                  </Label>
                </div>

                <div className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    id="neutered"
                    className="h-4 w-4"
                    {...register('neutered')}
                  />
                  <Label htmlFor="neutered" className="font-normal cursor-pointer">
                    Neutered/Spayed
                  </Label>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="status">Status *</Label>
                  <Select
                    id="status"
                    {...register('status', { required: 'Status is required' })}
                  >
                    <option value="Available">Available</option>
                    <option value="Pending">Pending</option>
                    <option value="Adopted">Adopted</option>
                  </Select>
                </div>
              </div>

              {/* Add New Photos Section */}
              <div className="space-y-4 p-4 border rounded-lg bg-muted/50">
                <div>
                  <Label>Add New Photos</Label>
                  <p className="text-sm text-muted-foreground">Upload new photos or provide image URLs</p>
                </div>

                {/* Toggle between File and URL */}
                <div className="flex gap-2">
                  <Button
                    type="button"
                    variant={imageInputType === 'file' ? 'default' : 'outline'}
                    size="sm"
                    onClick={() => setImageInputType('file')}
                    className={imageInputType === 'file' ? 'bg-gradient-to-r from-blue-600 to-purple-600' : ''}
                  >
                    <ImageIcon className="w-4 h-4 mr-2" />
                    Upload Files
                  </Button>
                  <Button
                    type="button"
                    variant={imageInputType === 'url' ? 'default' : 'outline'}
                    size="sm"
                    onClick={() => setImageInputType('url')}
                    className={imageInputType === 'url' ? 'bg-gradient-to-r from-blue-600 to-purple-600' : ''}
                  >
                    <LinkIcon className="w-4 h-4 mr-2" />
                    Image URLs
                  </Button>
                </div>

                {/* File Upload */}
                {imageInputType === 'file' && (
                  <div className="space-y-2">
                    <Input
                      type="file"
                      accept="image/*"
                      multiple
                      onChange={(e) => setSelectedPhotos(e.target.files)}
                    />
                    <p className="text-xs text-muted-foreground">
                      Select one or more images (JPEG, PNG, etc.)
                    </p>
                    {selectedPhotos && selectedPhotos.length > 0 && (
                      <p className="text-sm text-green-600">
                        ✓ {selectedPhotos.length} file(s) selected
                      </p>
                    )}
                  </div>
                )}

                {/* URL Input */}
                {imageInputType === 'url' && (
                  <div className="space-y-3">
                    <div className="flex gap-2">
                      <Input
                        value={currentUrl}
                        onChange={(e) => setCurrentUrl(e.target.value)}
                        placeholder="https://example.com/image.jpg"
                        onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addImageUrl())}
                      />
                      <Button type="button" onClick={addImageUrl} size="sm">
                        <Plus className="w-4 h-4 mr-1" />
                        Add
                      </Button>
                    </div>

                    {imageUrls.length > 0 && (
                      <div className="space-y-2">
                        <Label className="text-sm">Added URLs ({imageUrls.length}):</Label>
                        {imageUrls.map((url, index) => (
                          <div key={index} className="flex items-center gap-2 p-2 bg-background rounded border">
                            <LinkIcon className="w-4 h-4 text-muted-foreground flex-shrink-0" />
                            <span className="text-sm truncate flex-1">{url}</span>
                            <Button
                              type="button"
                              variant="ghost"
                              size="sm"
                              onClick={() => removeImageUrl(index)}
                              className="h-8 w-8 p-0"
                            >
                              <X className="w-4 h-4" />
                            </Button>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                )}
              </div>

              {/* Action Buttons */}
              <div className="flex gap-4 justify-end pt-4 border-t">
                <Button type="button" variant="outline" onClick={handleCancel}>
                  Cancel
                </Button>
                <Button
                  type="submit"
                  disabled={updateMutation.isPending}
                  className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
                >
                  {updateMutation.isPending ? 'Updating Pet...' : 'Update Pet'}
                </Button>
              </div>
            </CardContent>
          </Card>
        </form>
      </div>
    </AdminLayout>
  );
}
