import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { petsApi } from '@/api/pets';
import Header from '@/components/layout/Header';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select } from '@/components/ui/select';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Search, Filter, PawPrint, Heart, Check, MapPin } from 'lucide-react';

export default function PetList() {
  const [search, setSearch] = useState('');
  const [species, setSpecies] = useState('');
  const [page, setPage] = useState(1);

  const { data, isLoading } = useQuery({
    queryKey: ['pets', search, species, page],
    queryFn: () => petsApi.getAllPets({ search, species, page, limit: 12 }),
  });

  const pets = data?.pets || [];
  const pagination = data?.pagination || { total: 0, page: 1, pages: 1 };

  return (
    <div className="min-h-screen bg-muted/30">
      <Header />

      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-4xl font-bold mb-2 flex items-center gap-3">
            <PawPrint className="w-10 h-10 text-primary" />
            Available Pets
          </h1>
          <p className="text-muted-foreground">Find your perfect companion from our available pets</p>
        </div>

        {/* Filters */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-lg">
              <Filter className="w-5 h-5" />
              Filter Pets
            </CardTitle>
          </CardHeader>
          <CardContent className="flex flex-col md:flex-row gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input
                placeholder="Search by name or breed..."
                value={search}
                onChange={(e) => {
                  setSearch(e.target.value);
                  setPage(1);
                }}
                className="pl-10"
              />
            </div>
            <Select
              value={species}
              onChange={(e) => {
                setSpecies(e.target.value);
                setPage(1);
              }}
              className="md:w-48"
            >
              <option value="">All Species</option>
              <option value="Dog">Dogs</option>
              <option value="Cat">Cats</option>
              <option value="Bird">Birds</option>
              <option value="Rabbit">Rabbits</option>
              <option value="Other">Other</option>
            </Select>
          </CardContent>
        </Card>

        {/* Loading State */}
        {isLoading && (
          <div className="text-center py-12">
            <p className="text-muted-foreground">Loading pets...</p>
          </div>
        )}

        {/* Empty State */}
        {!isLoading && pets.length === 0 && (
          <Card className="text-center py-12">
            <CardContent className="pt-6">
              <PawPrint className="w-16 h-16 mx-auto text-muted-foreground/50 mb-4" />
              <p className="text-lg text-muted-foreground mb-4">No pets found matching your criteria</p>
              <Button onClick={() => { setSearch(''); setSpecies(''); }}>
                Clear Filters
              </Button>
            </CardContent>
          </Card>
        )}

        {/* Pet Grid */}
        {!isLoading && pets.length > 0 && (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {pets.map((pet: any) => (
                <Card key={pet._id} className="overflow-hidden hover:shadow-xl transition-all duration-300 group border-2 hover:border-primary/50 cursor-pointer">
                  <div className="aspect-square bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 dark:from-gray-800 dark:via-gray-700 dark:to-gray-600 flex items-center justify-center relative overflow-hidden">
                    {pet.photos && pet.photos.length > 0 ? (
                      <>
                        <img
                          src={pet.photos[0]}
                          alt={pet.name}
                          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                      </>
                    ) : (
                      <PawPrint className="w-20 h-20 text-muted-foreground/30" />
                    )}
                    {/* Status Badge */}
                    <div className="absolute top-3 right-3">
                      <span className={`text-xs px-3 py-1.5 rounded-full font-semibold shadow-lg backdrop-blur-sm ${
                        pet.status === 'Available'
                          ? 'bg-green-500/90 text-white'
                          : 'bg-gray-500/90 text-white'
                      }`}>
                        {pet.status}
                      </span>
                    </div>
                    {/* Health Badges */}
                    <div className="absolute bottom-3 left-3 flex gap-2">
                      {pet.vaccinated && (
                        <span className="bg-blue-500/90 text-white text-xs px-2 py-1 rounded-full font-medium flex items-center gap-1 backdrop-blur-sm">
                          <Check className="w-3 h-3" />
                          Vaccinated
                        </span>
                      )}
                      {pet.neutered && (
                        <span className="bg-purple-500/90 text-white text-xs px-2 py-1 rounded-full font-medium flex items-center gap-1 backdrop-blur-sm">
                          <Check className="w-3 h-3" />
                          Neutered
                        </span>
                      )}
                    </div>
                  </div>
                  <CardHeader className="pb-3">
                    <div className="flex justify-between items-start mb-2">
                      <CardTitle className="text-2xl font-bold text-foreground group-hover:text-primary transition-colors">
                        {pet.name}
                      </CardTitle>
                      <span className="text-lg font-semibold text-primary">
                        {pet.age} {pet.age === 1 ? 'yr' : 'yrs'}
                      </span>
                    </div>
                    <CardDescription className="text-sm font-medium flex items-center gap-2">
                      <span className="bg-primary/10 text-primary px-2 py-0.5 rounded">
                        {pet.species}
                      </span>
                      <span className="text-muted-foreground">•</span>
                      <span>{pet.breed}</span>
                    </CardDescription>
                    {pet.location && (
                      <div className="flex items-center gap-1 text-xs text-muted-foreground mt-2">
                        <MapPin className="w-3 h-3" />
                        {pet.location}
                      </div>
                    )}
                  </CardHeader>
                  <CardContent className="pb-4">
                    <p className="text-sm text-muted-foreground line-clamp-2 leading-relaxed">
                      {pet.description}
                    </p>
                    {pet.size && (
                      <div className="mt-3 flex items-center gap-2">
                        <span className="text-xs font-medium text-muted-foreground">Size:</span>
                        <span className="text-xs bg-accent px-2 py-1 rounded font-medium">
                          {pet.size}
                        </span>
                      </div>
                    )}
                  </CardContent>
                  <CardFooter className="bg-gradient-to-r from-primary/5 to-purple-500/5 dark:from-primary/10 dark:to-purple-500/10">
                    <Link to={`/pets/${pet._id}`} className="w-full">
                      <Button className="w-full bg-gradient-to-r from-primary to-purple-600 hover:from-primary/90 hover:to-purple-600/90 text-white font-semibold shadow-md hover:shadow-lg transition-all duration-300 cursor-pointer">
                        <Heart className="w-4 h-4 mr-2" />
                        Meet {pet.name}
                      </Button>
                    </Link>
                  </CardFooter>
                </Card>
              ))}
            </div>

            {/* Pagination */}
            {pagination.pages > 1 && (
              <div className="mt-8 flex justify-center gap-2">
                <Button
                  variant="outline"
                  onClick={() => setPage(p => Math.max(1, p - 1))}
                  disabled={page === 1}
                >
                  Previous
                </Button>
                <div className="flex items-center gap-2">
                  <span className="text-sm text-muted-foreground">
                    Page {page} of {pagination.pages}
                  </span>
                </div>
                <Button
                  variant="outline"
                  onClick={() => setPage(p => Math.min(pagination.pages, p + 1))}
                  disabled={page === pagination.pages}
                >
                  Next
                </Button>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}
