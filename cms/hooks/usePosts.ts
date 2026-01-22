'use client';

import { useEffect, useState } from 'react';
import { postsService, Post } from '@/src/services';

export function usePosts(params?: {
  page?: number;
  limit?: number;
  published?: boolean;
  categoryId?: string;
}) {
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 10,
    total: 0,
    totalPages: 0,
  });

  useEffect(() => {
    async function fetchPosts() {
      try {
        setLoading(true);
        setError(null);

        const response = await postsService.getPosts(params);

        if (response.success && response.data) {
          setPosts((response.data as any)?.posts || []);
          if ((response.data as any)?.pagination) {
            setPagination((response.data as any).pagination);
          }
        } else {
          throw new Error(response.error || 'Failed to fetch posts');
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to fetch posts');
      } finally {
        setLoading(false);
      }
    }

    fetchPosts();
  }, [params?.page, params?.limit, params?.published, params?.categoryId]);

  return { posts, loading, error, pagination };
}
