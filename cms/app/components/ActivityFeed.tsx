import { Activity } from '../types';
import { MdAdd, MdEdit, MdCheckCircle, MdInfo } from 'react-icons/md';

interface ActivityFeedProps {
  activities: Activity[];
}

export default function ActivityFeed({ activities }: ActivityFeedProps) {
  const getIconAndColor = (type: Activity['type']) => {
    switch (type) {
      case 'inquiry':
        return { icon: <MdAdd className="text-lg" />, color: 'bg-blue-100 text-blue-600' };
      case 'update':
        return { icon: <MdEdit className="text-lg" />, color: 'bg-orange-100 text-orange-600' };
      case 'success':
        return { icon: <MdCheckCircle className="text-lg" />, color: 'bg-green-100 text-green-600' };
      default:
        return { icon: <MdInfo className="text-lg" />, color: 'bg-gray-100 text-gray-600' };
    }
  };

  return (
    <div className="bg-white rounded-xl border border-gray-200 p-4">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-bold text-gray-900 ">Recent Activity</h3>
      </div>
      
      <div className="space-y-3">
        {activities.map((activity) => {
          const { icon, color } = getIconAndColor(activity.type);
          
          return (
            <div key={activity.id} className="flex gap-3 items-start pb-3 border-b last:border-b-0 border-gray-100">
              <div className={`${color} w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0`}>
                {icon}
              </div>
              <div className="flex-1 min-w-0">
                <h4 className="text-sm font-semibold text-gray-900 mb-1">
                  {activity.title}
                </h4>
                <p className="text-sm text-gray-600 mb-1 break-words line-clamp-2">
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

