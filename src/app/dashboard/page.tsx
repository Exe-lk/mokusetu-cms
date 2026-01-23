'use client';

import { useEffect, useMemo, useState } from 'react';
import { useRouter } from 'next/navigation';
import Layout from '../components/Layout';
import StatCard from '../components/StatCard';
import ActivityFeed from '../components/ActivityFeed';
import { useAppDispatch, useAppSelector } from '@/src/store/hooks';
import { fetchPosts } from '@/src/store/slices/postsSlice';
import { fetchServices } from '@/src/store/slices/servicesSlice';
import { loadStoredUser } from '@/src/store/slices/authSlice';
import { MdArticle, MdBusiness } from 'react-icons/md';

export default function Dashboard() {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const [authChecked, setAuthChecked] = useState(false);
  const { posts, loading: postsLoading } = useAppSelector((state) => state.posts);
  const { services, loading: servicesLoading } = useAppSelector((state) => state.services);
  const { isAuthenticated, user, loading: authLoading } = useAppSelector((state) => state.auth);

  useEffect(() => {
    dispatch(loadStoredUser());
    setAuthChecked(true);
  }, [dispatch]);

  useEffect(() => {
    if (authChecked && !isAuthenticated) {
      router.push('/');
      return;
    }

    if (authChecked && isAuthenticated && user?.role === 'admin') {
      dispatch(fetchPosts({ limit: 10 }));
      dispatch(fetchServices(true));
    }
  }, [dispatch, isAuthenticated, user, router, authChecked]);

  const stats = useMemo(() => {
    const totalPosts = posts.length;
    const publishedPosts = posts.filter((p) => p.published).length;
    const activeServices = services.filter((s) => s.active).length;

    return [
      {
        title: 'Total Posts',
        value: totalPosts.toString(),
        icon: <MdArticle />,
        color: 'blue',
        change: `${publishedPosts} published`,
        changeType: 'positive' as const,
      },
      {
        title: 'Active Services',
        value: activeServices.toString(),
        icon: <MdBusiness />,
        color: 'red',
        change: `${services.length} total`,
        changeType: 'neutral' as const,
      }
    ];
  }, [posts, services]);

  const recentPosts = useMemo(() => {
    return [...posts]
      .sort((a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime())
      .slice(0, 3);
  }, [posts]);

  const activities = useMemo(() => {
    const allItems: Array<{
      id: string;
      title: string;
      description: string;
      time: string;
      type: 'update' | 'success' | 'inquiry';
      date: Date;
    }> = [];

    recentPosts.slice(0, 3).forEach((post) => {
      allItems.push({
        id: `post-${post.id}`,
        title: post.published ? 'Post Published' : 'Post Updated',
        description: post.title,
        time: formatTimeAgo(new Date(post.updatedAt)),
        type: post.published ? 'success' : 'update',
        date: new Date(post.updatedAt),
      });
    });

    [...services]
      .sort((a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime())
      .slice(0, 2)
      .forEach((service) => {
        allItems.push({
          id: `service-${service.id}`,
          title: 'Service Updated',
          description: service.pageTitle,
          time: formatTimeAgo(new Date(service.updatedAt)),
          type: 'update',
          date: new Date(service.updatedAt),
        });
      });

    return allItems
      .sort((a, b) => b.date.getTime() - a.date.getTime())
      .slice(0, 3)
      .map((item) => ({
        id: item.id,
        title: item.title,
        description: item.description,
        time: item.time,
        type: item.type,
      }));
  }, [recentPosts, services]);

  const isLoading = postsLoading || servicesLoading || authLoading || !authChecked;
  
  if (!authChecked || !isAuthenticated || user?.role !== 'admin') {
    return (
      <div className="min-h-screen flex justify-center items-center">
        <div className="animate-spin rounded-full h-12 w-12 border-4 border-gray-300 border-t-red-600"></div>
      </div>
    );
  }

  return (
    <Layout title="Dashboard" subtitle="Here's what's happening with MokuSetu today.">
      <div className="space-y-4">
        {isLoading ? (
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-4 border-gray-300 border-t-red-600"></div>
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {stats.map((stat, index) => (
                <StatCard key={index} stat={stat} />
              ))}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
              <div className="lg:col-span-2">
                <div className="bg-white rounded-xl border border-gray-200 p-4">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-lg font-bold text-gray-900">Latest Blog Posts</h3>
                    <button
                      onClick={() => router.push('/blog')}
                      className="text-sm text-red-600 hover:text-red-700 font-medium"
                    >
                      View All Posts
                    </button>
                  </div>

                  {recentPosts.length === 0 ? (
                    <div className="text-center py-6 text-gray-500">
                      <p className="text-sm">No posts yet. Create your first post!</p>
                    </div>
                  ) : (
                    <div className="overflow-x-auto -mx-4 sm:mx-0">
                      <div className="inline-block min-w-full align-middle">
                        <table className="min-w-full divide-y divide-gray-200">
                          <thead className="bg-gray-50">
                            <tr>
                              <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                                Article Title
                              </th>
                              <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider hidden sm:table-cell">
                                Status
                              </th>
                              <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider hidden md:table-cell">
                                Date
                              </th>
                            </tr>
                          </thead>
                          <tbody className="bg-white divide-y divide-gray-200">
                            {recentPosts.map((post) => (
                              <tr key={post.id} className="hover:bg-gray-50">
                                <td className="px-4 py-3">
                                  <div className="flex items-center gap-3">
                                    <div
                                      className={`w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0 ${
                                        post.published
                                          ? 'bg-green-100'
                                          : 'bg-orange-100'
                                      }`}
                                    >
                                      <span className="text-base">
                                        {post.title.charAt(0).toUpperCase()}
                                      </span>
                                    </div>
                                    <div className="min-w-0">
                                      <p className="text-sm font-medium text-gray-900 truncate">
                                        {post.title}
                                      </p>
                                      <p className="text-xs text-gray-500 sm:hidden">
                                        {post.published ? 'Published' : 'Draft'} •{' '}
                                        {formatDate(post.updatedAt)}
                                      </p>
                                    </div>
                                  </div>
                                </td>
                                <td className="px-4 py-3 hidden sm:table-cell">
                                  <span
                                    className={`inline-flex px-2.5 py-1 text-xs font-semibold rounded-full ${
                                      post.published
                                        ? 'bg-green-100 text-green-800'
                                        : 'bg-orange-100 text-orange-800'
                                    }`}
                                  >
                                    {post.published ? 'Published' : 'Draft'}
                                  </span>
                                </td>
                                <td className="px-4 py-3 text-sm text-gray-600 hidden md:table-cell">
                                  {formatDate(post.updatedAt)}
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    </div>
                  )}
                </div>
              </div>

              <div className="lg:col-span-1">
                <ActivityFeed activities={activities} />
              </div>
            </div>
          </>
        )}
      </div>
    </Layout>
  );
}

function formatDate(date: Date | string): string {
  const d = typeof date === 'string' ? new Date(date) : date;
  return d.toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  });
}
  
function formatTimeAgo(date: Date | string): string {
  const d = typeof date === 'string' ? new Date(date) : date;
  const now = new Date();
  const diffInSeconds = Math.floor((now.getTime() - d.getTime()) / 1000);

  if (diffInSeconds < 60) return 'Just now';
  if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)}m ago`;
  if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)}h ago`;
  if (diffInSeconds < 604800) return `${Math.floor(diffInSeconds / 86400)}d ago`;
  return formatDate(d);
}

