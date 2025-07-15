import React from 'react';
import { DivideIcon as LucideIcon } from 'lucide-react';

interface StatsCardProps {
  title: string;
  value: string;
  change: string;
  changeType: 'positive' | 'negative' | 'neutral';
  icon: LucideIcon;
  color: string;
}

export const StatsCard: React.FC<StatsCardProps> = ({
  title,
  value,
  change,
  changeType,
  icon: Icon,
  color
}) => {
  const getChangeColor = () => {
    switch (changeType) {
      case 'positive': return 'text-green-600 dark:text-green-400';
      case 'negative': return 'text-red-600 dark:text-red-400';
      default: return 'text-gray-600 dark:text-gray-400';
    }
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl p-4 sm:p-6 shadow-sm border border-gray-200 dark:border-gray-700 transition-all duration-200 hover:shadow-lg hover:scale-105">
      <div className="flex items-center justify-between mb-4">
        <div className={`p-2 sm:p-3 rounded-lg ${color}`}>
          <Icon className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
        </div>
        <span className={`text-xs sm:text-sm font-medium ${getChangeColor()} truncate max-w-[120px]`}>
          {change}
        </span>
      </div>
      <div>
        <h3 className="text-xs sm:text-sm font-medium text-gray-600 dark:text-gray-400 mb-1">
          {title}
        </h3>
        <p className="text-lg sm:text-2xl font-bold text-gray-900 dark:text-white truncate">
          {value}
        </p>
      </div>
    </div>
  );
};