import { apiClient } from './client';
import type { AuthResponse } from '@/types';

export const authApi = {
  register: async (data: { name: string; email: string; password: string; company?: string }) => {
    const response = await apiClient.post<AuthResponse>('/auth/register', data);
    return response.data;
  },

  login: async (data: { email: string; password: string }) => {
    const response = await apiClient.post<AuthResponse>('/auth/login', data);
    return response.data;
  },

  logout: async () => {
    const response = await apiClient.get('/auth/logout');
    return response.data;
  },

  getProfile: async () => {
    const response = await apiClient.get('/auth/profile');
    return response.data;
  },

  updateProfile: async (data: { name?: string; company?: string }) => {
    const response = await apiClient.put('/auth/profile/update', data);
    return response.data;
  },

  updatePassword: async (data: { oldPassword: string; newPassword: string }) => {
    const response = await apiClient.put('/auth/password/update', data);
    return response.data;
  },

  forgotPassword: async (email: string) => {
    const response = await apiClient.post('/auth/password/forgot', { email });
    return response.data;
  },

  resetPassword: async (token: string, data: { password: string; confirmPassword: string }) => {
    const response = await apiClient.put(`/auth/password/reset/${token}`, data);
    return response.data;
  },
};
