import Layout from '../components/Layout';

export default function Team() {
  const teamMembers = [
    {
      id: 1,
      name: 'Takashi Mori',
      role: 'CEO & Founder',
      email: 'takashi@mokusetu.com',
      avatar: 'T',
      status: 'Active',
    },
    {
      id: 2,
      name: 'Admin User',
      role: 'Super Admin',
      email: 'admin@mokusetu.com',
      avatar: 'A',
      status: 'Active',
    },
    {
      id: 3,
      name: 'Kara Saitou',
      role: 'Content Writer',
      email: 'kara@mokusetu.com',
      avatar: 'K',
      status: 'Active',
    },
    {
      id: 4,
      name: 'Akane',
      role: 'Marketing Manager',
      email: 'akane@mokusetu.com',
      avatar: 'A',
      status: 'Active',
    },
  ];

  return (
    <Layout title="Team Members">
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h2 className="text-2xl font-bold text-gray-900">Manage Team</h2>
            <p className="text-gray-600 mt-1">{teamMembers.length} active members</p>
          </div>
          <button className="bg-red-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-red-700 transition-colors">
            + Add Member
          </button>
        </div>

        <div className="bg-white rounded-xl border border-gray-200">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                    Member
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider hidden md:table-cell">
                    Role
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider hidden lg:table-cell">
                    Email
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider hidden sm:table-cell">
                    Status
                  </th>
                  <th className="px-6 py-3 text-center text-xs font-semibold text-gray-600 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {teamMembers.map((member) => (
                  <tr key={member.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-red-600 rounded-full flex items-center justify-center flex-shrink-0">
                          <span className="text-white font-semibold">{member.avatar}</span>
                        </div>
                        <div className="min-w-0">
                          <p className="text-sm font-medium text-gray-900">{member.name}</p>
                          <p className="text-xs text-gray-500 md:hidden">{member.role}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-600 hidden md:table-cell">
                      {member.role}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-600 hidden lg:table-cell">
                      {member.email}
                    </td>
                    <td className="px-6 py-4 hidden sm:table-cell">
                      <span className="inline-flex px-3 py-1 text-xs font-semibold rounded-full bg-green-100 text-green-800">
                        {member.status}
                      </span>
                    </td>
                    <td className="px-6 py-4">
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
        </div>
      </div>
    </Layout>
  );
}

