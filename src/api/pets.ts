import { apiClient } from './client';

interface GetPetsParams {
  search?: string;
  species?: string;
  breed?: string;
  age?: number;
  status?: string;
  page?: number;
  limit?: number;
}

export const petsApi = {
  getAllPets: async (params?: GetPetsParams) => {
    const response = await apiClient.get('/pets', { params });
    return response.data;
  },

  getPetDetails: async (id: string) => {
    const response = await apiClient.get(`/pets/${id}`);
    return response.data;
  },

  createPet: async (data: FormData) => {
    const response = await apiClient.post('/admin/pets', data, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  },

  updatePet: async (id: string, data: FormData) => {
    const response = await apiClient.put(`/admin/pets/${id}`, data, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  },

  deletePet: async (id: string) => {
    const response = await apiClient.delete(`/admin/pets/${id}`);
    return response.data;
  },

  updatePetStatus: async (id: string, status: string) => {
    const response = await apiClient.put(`/admin/pets/${id}/status`, { status });
    return response.data;
  },

  getPetStats: async () => {
    const response = await apiClient.get('/admin/pets-stats');
    return response.data;
  },
};
