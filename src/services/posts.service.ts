import apiClient from '@/src/lib/api-client';

export interface Post {
  id: string;
  title: string;
  slug: string;
  content?: string;
  excerpt?: string;
  featuredImage?: string;
  published: boolean;
  publishedAt?: Date;
  createdAt: Date;
  updatedAt: Date;
  categoryId?: string;
}

export interface CreatePostDto {
  title: string;
  slug?: string;
  content?: string;
  excerpt?: string;
  featuredImage?: string;
  published?: boolean;
  categoryId?: string;
}

export interface UpdatePostDto {
  title?: string;
  slug?: string;
  content?: string;
  excerpt?: string;
  featuredImage?: string;
  published?: boolean;
  categoryId?: string;
}

export const postsService = {
  async getPosts(params?: {
    page?: number;
    limit?: number;
    published?: boolean;
    categoryId?: string;
  }) {
    const queryParams: Record<string, string> = {};
    
    if (params?.page) queryParams.page = params.page.toString();
    if (params?.limit) queryParams.limit = params.limit.toString();
    if (params?.published !== undefined) queryParams.published = params.published.toString();
    if (params?.categoryId) queryParams.categoryId = params.categoryId;

    return apiClient.get('/posts', queryParams);
  },

  async getPost(id: string) {
    return apiClient.get(`/posts/${id}`);
  },

  async createPost(data: CreatePostDto) {
    return apiClient.post('/posts', data);
  },

  async updatePost(id: string, data: UpdatePostDto) {
    return apiClient.put(`/posts/${id}`, data);
  },

  async deletePost(id: string) {
    return apiClient.delete(`/posts/${id}`);
  },
};
