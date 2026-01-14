import Layout from '../components/Layout';
import { MdLocationOn, MdBusinessCenter, MdHandshake, MdVerified } from 'react-icons/md';

export default function Services() {
  const services = [
    {
      id: 1,
      title: 'Market Entry Strategy',
      description: 'Strategic planning and consultation for entering the Japanese market',
      icon: <MdLocationOn className="text-2xl" />,
      status: 'Active',
    },
    {
      id: 2,
      title: 'Business Consulting',
      description: 'Expert guidance on Japanese business practices and culture',
      icon: <MdBusinessCenter className="text-2xl" />,
      status: 'Active',
    },
    {
      id: 3,
      title: 'Local Network Access',
      description: 'Connect with key partners and stakeholders in Japan',
      icon: <MdHandshake className="text-2xl" />,
      status: 'Active',
    },
    {
      id: 4,
      title: 'Quality Inspection',
      description: 'Ensure product quality meets Japanese standards',
      icon: <MdVerified className="text-2xl" />,
      status: 'Active',
    },
  ];

  return (
    <Layout title="Services">
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h2 className="text-2xl font-bold text-gray-900">Our Services</h2>
            <p className="text-gray-600 mt-1">Manage your service offerings</p>
          </div>
          <button className="bg-red-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-red-700 transition-colors">
            + Add Service
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {services.map((service) => (
            <div key={service.id} className="bg-white border border-gray-200 rounded-xl p-6 hover:shadow-lg transition-shadow">
              <div className="flex items-start justify-between mb-4">
                <div className="w-12 h-12 bg-red-100 rounded-lg flex items-center justify-center text-2xl">
                  {service.icon}
                </div>
                <span className="text-xs bg-green-100 text-green-800 px-2 py-1 rounded-full font-semibold">
                  {service.status}
                </span>
              </div>
              <h3 className="text-lg font-bold text-gray-900 mb-2">{service.title}</h3>
              <p className="text-sm text-gray-600 mb-4">{service.description}</p>
              <button className="text-red-600 hover:text-red-700 font-medium text-sm">
                Edit Service →
              </button>
            </div>
          ))}
        </div>
      </div>
    </Layout>
  );
}

