import axiosInstance from './axiosInstance';

// Auth API
export const authAPI = {
  register: (data: { name: string; email: string; password: string }) =>
    axiosInstance.post('/api/auth/register', data),
  
  login: (data: { email: string; password: string }) =>
    axiosInstance.post('/api/auth/login', data),
  
  refresh: (data: { refreshToken: string }) =>
    axiosInstance.post('/api/auth/refresh', data),
  
  logout: (data: { refreshToken: string }) =>
    axiosInstance.post('/api/auth/logout', data),
};

// Profile API
export const profileAPI = {
  getProfile: () =>
    axiosInstance.get('/api/profile'),
  
  updateProfile: (data: { name?: string; avatarUrl?: string }) =>
    axiosInstance.put('/api/profile', data),
  
  changePassword: (data: { currentPassword: string; newPassword: string }) =>
    axiosInstance.put('/api/profile/password', data),
  
  deleteAccount: (data: { password: string }) =>
    axiosInstance.delete('/api/profile', { data }),
};

// Tasks API
export const tasksAPI = {
  getAll: (params?: { q?: string; status?: string; page?: number; limit?: number }) =>
    axiosInstance.get('/api/tasks', { params }),
  
  create: (data: { 
    title: string; 
    description?: string; 
    status?: string; 
    priority?: string; 
    project?: string; 
    tags?: string[]; 
    dueDate?: string; 
    reminderAt?: string; 
  }) =>
    axiosInstance.post('/api/tasks', data),
  
  update: (id: string, data: { 
    title?: string; 
    description?: string; 
    status?: string; 
    priority?: string; 
    project?: string; 
    tags?: string[]; 
    dueDate?: string; 
    reminderAt?: string; 
  }) =>
    axiosInstance.put(`/api/tasks/${id}`, data),
  
  delete: (id: string, hardDelete = false) =>
    axiosInstance.delete(`/api/tasks/${id}${hardDelete ? '/hard' : ''}`),
  
  restore: (id: string) =>
    axiosInstance.post(`/api/tasks/${id}/restore`),
  
  sync: (data: { operations: any[] }) =>
    axiosInstance.post('/api/tasks/sync', data),
};
