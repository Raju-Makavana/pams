import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useForm } from 'react-hook-form';
import { petsApi } from '@/api/pets';
import AdminLayout from '@/components/layout/AdminLayout';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select } from '@/components/ui/select';
import Swal from 'sweetalert2';
import { ArrowLeft, Image as ImageIcon, Link as LinkIcon, Plus, X } from 'lucide-react';

interface PetForm {
  name: string;
  species: string;
  breed: string;
  age: number;
  gender: string;
  size: string;
  color?: string;
  description: string;
  medicalHistory?: string;
  vaccinated: boolean;
  neutered: boolean;
  status: string;
  location?: string;
}

export default function AddNewPet() {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [imageInputType, setImageInputType] = useState<'file' | 'url'>('file');
  const [selectedFiles, setSelectedFiles] = useState<FileList | null>(null);
  const [imageUrls, setImageUrls] = useState<string[]>([]);
  const [currentUrl, setCurrentUrl] = useState('');

  const { register, handleSubmit, formState: { errors } } = useForm<PetForm>({
    defaultValues: {
      vaccinated: true,
      neutered: false,
      status: 'Available'
    }
  });

  const createMutation = useMutation({
    mutationFn: (data: FormData) => petsApi.createPet(data),
    onSuccess: () => {
      Swal.fire({
        icon: 'success',
        title: 'Pet Added!',
        text: 'Pet has been successfully added to the system',
        confirmButtonText: 'OK',
        timer: 2000,
        timerProgressBar: true
      });
      queryClient.invalidateQueries({ queryKey: ['admin-pets'] });
      navigate('/admin/pets');
    },
    onError: (error: any) => {
      Swal.fire({
        icon: 'error',
        title: 'Failed to Add Pet',
        text: error.response?.data?.message || 'Something went wrong. Please try again.',
        confirmButtonText: 'OK'
      });
    },
  });

  const onSubmit = (data: PetForm) => {
    const formData = new FormData();

    // Append all form fields
    Object.entries(data).forEach(([key, value]) => {
      if (value !== undefined && value !== '') {
        formData.append(key, String(value));
      }
    });

    // Handle image files
    if (imageInputType === 'file' && selectedFiles) {
      Array.from(selectedFiles).forEach(file => {
        formData.append('photos', file);
      });
    }

    // Handle image URLs
    if (imageInputType === 'url' && imageUrls.length > 0) {
      imageUrls.forEach(url => {
        formData.append('photoUrls', url);
      });
    }

    createMutation.mutate(formData);
  };

  const addImageUrl = () => {
    if (currentUrl.trim()) {
      setImageUrls([...imageUrls, currentUrl.trim()]);
      setCurrentUrl('');
    }
  };

  const removeImageUrl = (index: number) => {
    setImageUrls(imageUrls.filter((_, i) => i !== index));
  };

  const handleCancel = () => {
    navigate('/admin/pets');
  };

  return (
    <AdminLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold">Add New Pet</h1>
            <p className="text-muted-foreground mt-1">Add a new pet to the adoption system</p>
          </div>
          <Button variant="outline" onClick={handleCancel}>
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to List
          </Button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit(onSubmit)}>
          <Card>
            <CardHeader>
              <CardTitle>Pet Information</CardTitle>
              <CardDescription>Fill in all the details about the pet</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Basic Information */}
              <div className="grid md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="name">Pet Name *</Label>
                  <Input
                    id="name"
                    placeholder="e.g., Max"
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
                    placeholder="e.g., Golden Retriever"
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
                    placeholder="e.g., 3"
                    {...register('age', { required: 'Age is required', valueAsNumber: true, min: 0 })}
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
                  <Input id="color" placeholder="e.g., Golden" {...register('color')} />
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
                  placeholder="Describe the pet's personality, behavior, and special needs..."
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
                  placeholder="Vaccinations, treatments, health conditions..."
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
                    defaultChecked
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

              {/* Image Upload Section */}
              <div className="space-y-4 p-4 border rounded-lg bg-muted/50">
                <div>
                  <Label>Pet Photos</Label>
                  <p className="text-sm text-muted-foreground">Upload photos or provide image URLs</p>
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
                      onChange={(e) => setSelectedFiles(e.target.files)}
                    />
                    <p className="text-xs text-muted-foreground">
                      Select one or more images (JPEG, PNG, etc.)
                    </p>
                    {selectedFiles && selectedFiles.length > 0 && (
                      <p className="text-sm text-green-600">
                        ✓ {selectedFiles.length} file(s) selected
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
                  disabled={createMutation.isPending}
                  className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
                >
                  {createMutation.isPending ? 'Adding Pet...' : 'Add Pet'}
                </Button>
              </div>
            </CardContent>
          </Card>
        </form>
      </div>
    </AdminLayout>
  );
}
