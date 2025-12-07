/**
 * Stats Card Component
 */

import { LucideIcon } from 'lucide-react';

interface StatsCardProps {
  title: string;
  value: string;
  icon: LucideIcon;
  color: 'blue' | 'green' | 'purple';
}

const colorClasses = {
  blue: 'bg-blue-100 text-blue-600',
  green: 'bg-accent-100 text-accent-600',
  purple: 'bg-purple-100 text-purple-600',
};

export function StatsCard({ title, value, icon: Icon, color }: StatsCardProps) {
  return (
    <div className="bg-white rounded-lg border border-primary-200 p-6 hover:shadow-md transition-shadow duration-200">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-medium text-primary-600">{title}</p>
          <p className="text-2xl font-bold text-primary-900 mt-2">{value}</p>
        </div>
        <div className={`p-3 rounded-lg ${colorClasses[color]}`}>
          <Icon className="h-6 w-6" />
        </div>
      </div>
    </div>
  );
}
