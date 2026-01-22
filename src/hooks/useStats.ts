'use client';

import { useEffect, useState } from 'react';
import { postsService, pagesService, usersService } from '@/src/services';

export interface DashboardStats {
  totalPosts: number;
  publishedPosts: number;
  totalPages: number;
  totalUsers: number;
  loading: boolean;
  error: string | null;
}

export function useStats() {
  const [stats, setStats] = useState<DashboardStats>({
    totalPosts: 0,
    publishedPosts: 0,
    totalPages: 0,
    totalUsers: 0,
    loading: true,
    error: null,
  });

  useEffect(() => {
    async function fetchStats() {
      try {
        setStats(prev => ({ ...prev, loading: true, error: null }));

        const [postsRes, publishedPostsRes, pagesRes, usersRes] = await Promise.all([
          postsService.getPosts({ limit: 1 }),
          postsService.getPosts({ published: true, limit: 1 }),
          pagesService.getPages(),
          usersService.getUsers(1, 1),
        ]);

        if (postsRes.success && publishedPostsRes.success && pagesRes.success && usersRes.success) {
          setStats({
            totalPosts: (postsRes.data as any)?.pagination?.total || 0,
            publishedPosts: (publishedPostsRes.data as any)?.pagination?.total || 0,
            totalPages: (pagesRes.data as any)?.pages?.length || 0,
            totalUsers: (usersRes.data as any)?.pagination?.total || 0,
            loading: false,
            error: null,
          });
        } else {
          throw new Error('Failed to fetch stats');
        }
      } catch (error) {
        setStats(prev => ({
          ...prev,
          loading: false,
          error: error instanceof Error ? error.message : 'Failed to fetch stats',
        }));
      }
    }

    fetchStats();
  }, []);

  return stats;
}
