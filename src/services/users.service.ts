import apiClient from '@/src/lib/api-client';

export interface User {
  id: string;
  email: string;
  name?: string;
  role: string;
  avatar?: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface CreateUserDto {
  email: string;
  name?: string;
  role?: string;
  avatar?: string;
}

export interface UpdateUserDto {
  email?: string;
  name?: string;
  role?: string;
  avatar?: string;
}

export const usersService = {
  async getUsers(page = 1, limit = 10) {
    return apiClient.get('/users', {
      page: page.toString(),
      limit: limit.toString(),
    });
  },

  async getUser(id: string) {
    return apiClient.get(`/users/${id}`);
  },

  async createUser(data: CreateUserDto) {
    return apiClient.post('/users', data);
  },

  async updateUser(id: string, data: UpdateUserDto) {
    return apiClient.put(`/users/${id}`, data);
  },

  async deleteUser(id: string) {
    return apiClient.delete(`/users/${id}`);
  },
};
