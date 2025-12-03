import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { petsApi } from '@/api/pets';
import AdminLayout from '@/components/layout/AdminLayout';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ImageGallery } from '@/components/ui/image-gallery';
import Swal from 'sweetalert2';
import { ImagePlus, Plus } from 'lucide-react';

export default function PetManagement() {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [viewingPet, setViewingPet] = useState<any>(null);

  const { data, isLoading } = useQuery({
    queryKey: ['admin-pets'],
    queryFn: () => petsApi.getAllPets({}),
  });

  const pets = data?.pets || [];

  const deleteMutation = useMutation({
    mutationFn: (id: string) => petsApi.deletePet(id),
    onSuccess: () => {
      Swal.fire({
        icon: 'success',
        title: 'Pet Deleted!',
        text: 'Pet has been removed successfully',
        confirmButtonText: 'OK',
        timer: 2000,
        timerProgressBar: true
      });
      queryClient.invalidateQueries({ queryKey: ['admin-pets'] });
    },
    onError: (error: any) => {
      Swal.fire({
        icon: 'error',
        title: 'Deletion Failed',
        text: error.response?.data?.message || 'Failed to delete pet',
        confirmButtonText: 'OK'
      });
    },
  });

  const handleAddNew = () => {
    navigate('/admin/pets/new');
  };

  const handleEdit = (pet: any) => {
    navigate(`/admin/pets/edit/${pet._id}`);
  };

  const handleDelete = (id: string) => {
    if (window.confirm('Are you sure you want to delete this pet?')) {
      deleteMutation.mutate(id);
    }
  };

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold">Pet Management</h1>
            <p className="text-muted-foreground mt-1">Manage all pets in the system</p>
          </div>
          <Button
            onClick={handleAddNew}
            className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
          >
            <Plus className="w-4 h-4 mr-2" />
            Add New Pet
          </Button>
        </div>

        {/* Pets List */}
        {isLoading ? (
          <p className="text-center text-muted-foreground">Loading pets...</p>
        ) : pets.length === 0 ? (
          <Card>
            <CardContent className="py-8 text-center">
              <p className="text-muted-foreground">No pets found. Add your first pet!</p>
            </CardContent>
          </Card>
        ) : (
          <div className="grid gap-6">
            {pets.map((pet: any) => (
              <Card key={pet._id} className="overflow-hidden">
                <CardContent className="p-6">
                  <div className="grid md:grid-cols-[300px,1fr] gap-6">
                    {/* Image Gallery */}
                    <div>
                      {pet.photos && pet.photos.length > 0 ? (
                        <ImageGallery images={pet.photos} alt={pet.name} />
                      ) : (
                        <div className="w-full aspect-video bg-linear-to-br from-blue-100 to-purple-100 dark:from-gray-800 dark:to-gray-700 rounded-lg flex items-center justify-center">
                          <ImagePlus className="w-12 h-12 text-muted-foreground" />
                        </div>
                      )}
                    </div>

                    {/* Pet Details */}
                    <div className="flex flex-col">
                      <div className="flex justify-between items-start mb-3">
                        <div>
                          <h3 className="text-2xl font-bold mb-1">{pet.name}</h3>
                          <p className="text-muted-foreground flex items-center gap-2 flex-wrap">
                            <span className="font-medium">{pet.species}</span>
                            <span>•</span>
                            <span>{pet.breed}</span>
                            <span>•</span>
                            <span>{pet.age} years</span>
                            <span>•</span>
                            <span>{pet.gender}</span>
                            <span>•</span>
                            <span>{pet.size}</span>
                          </p>
                        </div>
                        <span
                          className={`px-3 py-1 rounded-full text-sm font-medium whitespace-nowrap ${
                            pet.status === 'Available'
                              ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
                              : pet.status === 'Pending'
                              ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200'
                              : 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-200'
                          }`}
                        >
                          {pet.status}
                        </span>
                      </div>

                      <p className="text-sm mb-4 line-clamp-3">{pet.description}</p>

                      <div className="grid grid-cols-2 gap-3 mb-4 text-sm">
                        {pet.color && (
                          <div>
                            <span className="font-semibold">Color:</span> {pet.color}
                          </div>
                        )}
                        <div>
                          <span className="font-semibold">Vaccinated:</span>{' '}
                          {pet.vaccinated ? '✓ Yes' : '✗ No'}
                        </div>
                        <div>
                          <span className="font-semibold">Neutered:</span>{' '}
                          {pet.neutered ? '✓ Yes' : '✗ No'}
                        </div>
                        {pet.location && (
                          <div>
                            <span className="font-semibold">Location:</span> {pet.location}
                          </div>
                        )}
                      </div>

                      {pet.medicalHistory && (
                        <div className="mb-4 text-sm">
                          <span className="font-semibold">Medical History:</span>
                          <p className="text-muted-foreground mt-1">{pet.medicalHistory}</p>
                        </div>
                      )}

                      <div className="flex gap-2 mt-auto">
                        <Button variant="outline" size="sm" onClick={() => handleEdit(pet)}>
                          Edit
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleDelete(pet._id)}
                          disabled={deleteMutation.isPending}
                          className="text-destructive hover:text-destructive"
                        >
                          Delete
                        </Button>
                        {pet.photos && pet.photos.length > 0 && (
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => setViewingPet(pet)}
                          >
                            View Gallery ({pet.photos.length})
                          </Button>
                        )}
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}

        {/* Image Gallery Modal */}
        {viewingPet && (
          <div
            className="fixed inset-0 z-50 bg-black/90 flex items-center justify-center p-4"
            onClick={() => setViewingPet(null)}
          >
            <div className="max-w-4xl w-full" onClick={(e) => e.stopPropagation()}>
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-2xl font-bold text-white">{viewingPet.name}'s Photos</h2>
                <Button
                  variant="ghost"
                  size="sm"
                  className="text-white hover:bg-white/20"
                  onClick={() => setViewingPet(null)}
                >
                  Close
                </Button>
              </div>
              <ImageGallery images={viewingPet.photos} alt={viewingPet.name} />
            </div>
          </div>
        )}
      </div>
    </AdminLayout>
  );
}
