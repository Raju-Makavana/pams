import { apiClient } from './client';
import type { Application } from '@/types';

export const applicationsApi = {
  createApplication: async (petId: string, data: Partial<Application>) => {
    const response = await apiClient.post(`/applications/pet/${petId}`, data);
    return response.data;
  },

  getMyApplications: async () => {
    const response = await apiClient.get('/applications/my');
    return response.data;
  },

  getApplicationDetails: async (id: string) => {
    const response = await apiClient.get(`/applications/${id}`);
    return response.data;
  },

  deleteApplication: async (id: string) => {
    const response = await apiClient.delete(`/applications/${id}`);
    return response.data;
  },

  getAllApplications: async (params?: { status?: string; page?: number; limit?: number }) => {
    const response = await apiClient.get('/admin/applications', { params });
    return response.data;
  },

  updateApplicationStatus: async (id: string, data: { status: string; adminNotes?: string }) => {
    const response = await apiClient.put(`/admin/applications/${id}/status`, data);
    return response.data;
  },

  getApplicationStats: async () => {
    const response = await apiClient.get('/admin/applications-stats');
    return response.data;
  },
};
