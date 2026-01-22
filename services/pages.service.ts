import apiClient from '@/lib/api-client';

export interface Page {
  id: string;
  title: string;
  slug: string;
  content?: string;
  published: boolean;
  createdAt: Date;
  updatedAt: Date;
  authorId: string;
}

export interface CreatePageDto {
  title: string;
  slug?: string;
  content?: string;
  published?: boolean;
  authorId: string;
}

export interface UpdatePageDto {
  title?: string;
  slug?: string;
  content?: string;
  published?: boolean;
}

export const pagesService = {
  async getPages(published?: boolean) {
    const params = published !== undefined ? { published: published.toString() } : undefined;
    return apiClient.get('/pages', params);
  },

  async getPage(id: string) {
    return apiClient.get(`/pages/${id}`);
  },

  async createPage(data: CreatePageDto) {
    return apiClient.post('/pages', data);
  },

  async updatePage(id: string, data: UpdatePageDto) {
    return apiClient.put(`/pages/${id}`, data);
  },

  async deletePage(id: string) {
    return apiClient.delete(`/pages/${id}`);
  },
};
