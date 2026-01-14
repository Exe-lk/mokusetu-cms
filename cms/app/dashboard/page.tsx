import Layout from '../components/Layout';
import StatCard from '../components/StatCard';
import ActivityFeed from '../components/ActivityFeed';
import { dashboardStats, recentActivities, blogPosts } from '../data/mockData';

export default function Dashboard() {
  return (
    <Layout title="Good Morning, Admin">
      <div className="space-y-6">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
          {dashboardStats.map((stat, index) => (
            <StatCard key={index} stat={stat} />
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2">
            <div className="bg-white rounded-xl border border-gray-200 p-4 sm:p-6">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-lg font-bold text-gray-900">Latest Blog Updates</h3>
                <button className="text-sm text-red-600 hover:text-red-700 font-medium">
                  View All Posts
                </button>
              </div>
              
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
                        <th className="px-4 py-3 text-right text-xs font-semibold text-gray-600 uppercase tracking-wider">
                          Actions
                        </th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {blogPosts.slice(0, 3).map((post) => (
                        <tr key={post.id} className="hover:bg-gray-50">
                          <td className="px-4 py-4">
                            <div className="flex items-center gap-3">
                              <div className={`w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0 ${
                                post.status === 'Published' ? 'bg-green-100' : 'bg-orange-100'
                              }`}>
                                <span className="text-lg">
                                  {post.title.charAt(0)}
                                </span>
                              </div>
                              <div className="min-w-0">
                                <p className="text-sm font-medium text-gray-900 truncate">
                                  {post.title}
                                </p>
                                <p className="text-xs text-gray-500 sm:hidden">
                                  {post.status} • {post.publishedDate}
                                </p>
                              </div>
                            </div>
                          </td>
                          <td className="px-4 py-4 hidden sm:table-cell">
                            <span className={`inline-flex px-3 py-1 text-xs font-semibold rounded-full ${
                              post.status === 'Published' 
                                ? 'bg-green-100 text-green-800' 
                                : 'bg-orange-100 text-orange-800'
                            }`}>
                              {post.status}
                            </span>
                          </td>
                          <td className="px-4 py-4 text-sm text-gray-600 hidden md:table-cell">
                            {post.publishedDate}
                          </td>
                          <td className="px-4 py-4 text-right">
                            <button className="text-gray-400 hover:text-gray-600">
                              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                              </svg>
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </div>

          <div className="lg:col-span-1">
            <ActivityFeed activities={recentActivities} />
          </div>
        </div>
      </div>
    </Layout>
  );
}

