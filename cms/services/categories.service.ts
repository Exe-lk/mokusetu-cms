import apiClient from '@/lib/api-client';

export interface Category {
  id: string;
  name: string;
  slug: string;
  description?: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface CreateCategoryDto {
  name: string;
  slug?: string;
  description?: string;
}

export interface UpdateCategoryDto {
  name?: string;
  slug?: string;
  description?: string;
}

export const categoriesService = {
  async getCategories() {
    return apiClient.get('/categories');
  },

  async getCategory(id: string) {
    return apiClient.get(`/categories/${id}`);
  },

  async createCategory(data: CreateCategoryDto) {
    return apiClient.post('/categories', data);
  },

  async updateCategory(id: string, data: UpdateCategoryDto) {
    return apiClient.put(`/categories/${id}`, data);
  },

  async deleteCategory(id: string) {
    return apiClient.delete(`/categories/${id}`);
  },
};
