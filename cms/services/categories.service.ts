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
    // Debug log to ensure correct endpoint is used
    if (process.env.NODE_ENV !== 'production') {
      // eslint-disable-next-line no-console
      console.log('[categoriesService] getCategories()');
    }
    // apiClient already prefixes with `/api`, so this becomes `/api/categories`
    const res = await apiClient.get('/categories');
    if (process.env.NODE_ENV !== 'production') {
      // eslint-disable-next-line no-console
      console.log('[categoriesService] getCategories response:', res);
    }
    return res;
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
