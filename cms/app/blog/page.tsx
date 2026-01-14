'use client';

import { useState } from 'react';
import Layout from '../components/Layout';
import { blogPosts } from '../data/mockData';
import { BlogPost } from '../types';
import { MdEdit, MdArticle, MdCheckCircle, MdDescription } from 'react-icons/md';

export default function BlogManagement() {
  const [filter, setFilter] = useState<'all' | 'Published' | 'Draft'>('all');
  const [searchQuery, setSearchQuery] = useState('');

  const filteredPosts = blogPosts.filter(post => {
    const matchesFilter = filter === 'all' || post.status === filter;
    const matchesSearch = post.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         post.author.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesFilter && matchesSearch;
  });

  const stats = {
    total: blogPosts.length,
    published: blogPosts.filter(p => p.status === 'Published').length,
    drafts: blogPosts.filter(p => p.status === 'Draft').length,
  };

  return (
    <Layout title="Blog Management">
      <div className="space-y-6">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="bg-white border border-gray-200 rounded-xl p-6 hover:shadow-lg transition-shadow">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 font-medium mb-1">Total Posts</p>
                <h3 className="text-3xl font-bold text-gray-900">{stats.total}</h3>
              </div>
              <div className="w-12 h-12 bg-blue-500 rounded-lg flex items-center justify-center text-white">
                <MdEdit className="text-2xl" />
              </div>
            </div>
          </div>
          
          <div className="bg-white border border-gray-200 rounded-xl p-6 hover:shadow-lg transition-shadow">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 font-medium mb-1">Published</p>
                <h3 className="text-3xl font-bold text-green-600">{stats.published}</h3>
              </div>
              <div className="w-12 h-12 bg-green-500 rounded-lg flex items-center justify-center text-white">
                <MdCheckCircle className="text-2xl" />
              </div>
            </div>
          </div>
          
          <div className="bg-white border border-gray-200 rounded-xl p-6 hover:shadow-lg transition-shadow">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 font-medium mb-1">Drafts</p>
                <h3 className="text-3xl font-bold text-orange-600">{stats.drafts}</h3>
              </div>
              <div className="w-12 h-12 bg-orange-500 rounded-lg flex items-center justify-center text-white">
                <MdDescription className="text-2xl" />
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl border border-gray-200">
          <div className="p-4 sm:p-6 border-b border-gray-200">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
              <div>
                <h2 className="text-xl font-bold text-gray-900">Manage Articles</h2>
                <p className="text-sm text-gray-500 mt-1">
                  Showing 1 to {filteredPosts.length} of {stats.total} entries
                </p>
              </div>
              <button className="bg-red-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-red-700 transition-colors flex items-center justify-center gap-2">
                <span className="text-xl">+</span>
                <span>New Post</span>
              </button>
            </div>
          </div>

          <div className="p-4 sm:p-6 border-b border-gray-200 bg-gray-50">
            <div className="flex flex-col sm:flex-row gap-4">
              <div className="flex-1">
                <div className="relative">
                  <input
                    type="text"
                    placeholder="Search articles..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full px-4 py-2 pl-10 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                  />
                  <svg 
                    className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400"
                    fill="none" 
                    stroke="currentColor" 
                    viewBox="0 0 24 24"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                  </svg>
                </div>
              </div>

              <div className="flex gap-2">
                <button
                  onClick={() => setFilter('all')}
                  className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                    filter === 'all' 
                      ? 'bg-red-600 text-white' 
                      : 'bg-white text-gray-700 border border-gray-300 hover:bg-gray-50'
                  }`}
                >
                  All Status
                </button>
                <button
                  onClick={() => setFilter('Published')}
                  className={`px-4 py-2 rounded-lg font-medium transition-colors hidden sm:block ${
                    filter === 'Published' 
                      ? 'bg-red-600 text-white' 
                      : 'bg-white text-gray-700 border border-gray-300 hover:bg-gray-50'
                  }`}
                >
                  Published
                </button>
                <button
                  onClick={() => setFilter('Draft')}
                  className={`px-4 py-2 rounded-lg font-medium transition-colors hidden sm:block ${
                    filter === 'Draft' 
                      ? 'bg-red-600 text-white' 
                      : 'bg-white text-gray-700 border border-gray-300 hover:bg-gray-50'
                  }`}
                >
                  Draft
                </button>
              </div>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-4 sm:px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                    Post Title
                  </th>
                  <th className="px-4 sm:px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider hidden md:table-cell">
                    Author
                  </th>
                  <th className="px-4 sm:px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider hidden sm:table-cell">
                    Status
                  </th>
                  <th className="px-4 sm:px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider hidden lg:table-cell">
                    Published Date
                  </th>
                  <th className="px-4 sm:px-6 py-3 text-center text-xs font-semibold text-gray-600 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredPosts.map((post) => (
                  <tr key={post.id} className="hover:bg-gray-50">
                    <td className="px-4 sm:px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className={`w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0 ${
                          post.status === 'Published' ? 'bg-green-100' : 'bg-orange-100'
                        }`}>
                          <span className="text-lg font-semibold">
                            {post.title.charAt(0)}
                          </span>
                        </div>
                        <div className="min-w-0">
                          <p className="text-sm font-medium text-gray-900 truncate">
                            {post.title}
                          </p>
                          <p className="text-xs text-gray-500 md:hidden">
                            {post.author}
                          </p>
                        </div>
                      </div>
                    </td>
                    <td className="px-4 sm:px-6 py-4 text-sm text-gray-600 hidden md:table-cell">
                      {post.author}
                    </td>
                    <td className="px-4 sm:px-6 py-4 hidden sm:table-cell">
                      <span className={`inline-flex px-3 py-1 text-xs font-semibold rounded-full ${
                        post.status === 'Published' 
                          ? 'bg-green-100 text-green-800' 
                          : 'bg-orange-100 text-orange-800'
                      }`}>
                        {post.status}
                      </span>
                    </td>
                    <td className="px-4 sm:px-6 py-4 text-sm text-gray-600 hidden lg:table-cell">
                      {post.publishedDate}
                    </td>
                    <td className="px-4 sm:px-6 py-4">
                      <div className="flex items-center justify-center gap-2">
                        <button className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors">
                          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                          </svg>
                        </button>
                        <button className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors">
                          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                          </svg>
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="p-4 sm:p-6 border-t border-gray-200 bg-gray-50">
            <div className="flex items-center justify-center gap-2">
              <button className="w-10 h-10 flex items-center justify-center bg-red-600 text-white rounded-lg font-semibold hover:bg-red-700 transition-colors">
                1
              </button>
              <button className="w-10 h-10 flex items-center justify-center bg-white text-gray-700 border border-gray-300 rounded-lg font-semibold hover:bg-gray-50 transition-colors">
                2
              </button>
              <button className="w-10 h-10 flex items-center justify-center bg-white text-gray-700 border border-gray-300 rounded-lg font-semibold hover:bg-gray-50 transition-colors">
                3
              </button>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
}

