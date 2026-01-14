import { Activity } from '../types';
import { MdAdd, MdEdit, MdCheckCircle, MdInfo } from 'react-icons/md';

interface ActivityFeedProps {
  activities: Activity[];
}

export default function ActivityFeed({ activities }: ActivityFeedProps) {
  const getIconAndColor = (type: Activity['type']) => {
    switch (type) {
      case 'inquiry':
        return { icon: <MdAdd className="text-xl" />, color: 'bg-blue-100 text-blue-600' };
      case 'update':
        return { icon: <MdEdit className="text-xl" />, color: 'bg-orange-100 text-orange-600' };
      case 'success':
        return { icon: <MdCheckCircle className="text-xl" />, color: 'bg-green-100 text-green-600' };
      default:
        return { icon: <MdInfo className="text-xl" />, color: 'bg-gray-100 text-gray-600' };
    }
  };

  return (
    <div className="bg-white rounded-xl border border-gray-200 p-4 sm:p-6">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-bold text-gray-900">Recent Activity</h3>
        <button className="text-sm text-blue-600 hover:text-blue-700 font-medium">
          View All
        </button>
      </div>
      
      <div className="space-y-4">
        {activities.map((activity) => {
          const { icon, color } = getIconAndColor(activity.type);
          
          return (
            <div key={activity.id} className="flex gap-4 items-start pb-4 border-b last:border-b-0 border-gray-100">
              <div className={`${color} w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0`}>
                {icon}
              </div>
              <div className="flex-1 min-w-0">
                <h4 className="text-sm font-semibold text-gray-900 mb-1">
                  {activity.title}
                </h4>
                <p className="text-sm text-gray-600 mb-2 break-words">
                  {activity.description}
                </p>
                <span className="text-xs text-gray-400 font-medium">
                  {activity.time}
                </span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

