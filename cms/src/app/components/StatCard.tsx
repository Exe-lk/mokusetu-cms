import { StatCard as StatCardType } from '../types';

export default function StatCard({ stat }: { stat: StatCardType }) {
  const bgColors = {
    blue: 'bg-blue-50 border-blue-200',
    red: 'bg-red-50 border-red-200',
    orange: 'bg-orange-50 border-orange-200',
    green: 'bg-green-50 border-green-200',
  };

  const iconBg = {
    blue: 'bg-blue-500',
    red: 'bg-red-500',
    orange: 'bg-orange-500',
    green: 'bg-green-500',
  };

  return (
    <div className={`${bgColors[stat.color as keyof typeof bgColors]} border rounded-xl p-4 hover:shadow-lg transition-shadow`}>
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <p className="text-xs sm:text-sm font-medium text-gray-600 uppercase tracking-wide mb-2">
            {stat.title}
          </p>
          <h3 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-2">
            {stat.value}
          </h3>
          {stat.change && (
            <p className={`text-xs sm:text-sm font-medium ${
              stat.changeType === 'positive' ? 'text-green-600' : 
              stat.changeType === 'negative' ? 'text-red-600' : 
              'text-gray-600'
            }`}>
              {stat.change}
            </p>
          )}
        </div>
        <div className={`${iconBg[stat.color as keyof typeof iconBg]} w-12 h-12 rounded-lg flex items-center justify-center text-2xl text-white`}>
          {stat.icon}
        </div>
      </div>
    </div>
  );
}

