import apiClient from '@/src/lib/api-client';

export interface Tag {
  id: string;
  name: string;
  slug: string;
  createdAt: Date;
}

export interface CreateTagDto {
  name: string;
  slug?: string;
}

export const tagsService = {
  async getTags() {
    return apiClient.get('/tags');
  },

  async createTag(data: CreateTagDto) {
    return apiClient.post('/tags', data);
  },
};
