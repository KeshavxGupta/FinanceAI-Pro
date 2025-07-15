import React from 'react';
import { DivideIcon as LucideIcon } from 'lucide-react';

interface HealthScoreCardProps {
  title: string;
  score: number;
  icon: LucideIcon;
  description: string;
}

export const HealthScoreCard: React.FC<HealthScoreCardProps> = ({
  title,
  score,
  icon: Icon,
  description
}) => {
  const getScoreColor = (score: number) => {
    if (score >= 80) return 'text-green-600 dark:text-green-400';
    if (score >= 60) return 'text-yellow-600 dark:text-yellow-400';
    return 'text-red-600 dark:text-red-400';
  };

  const getProgressColor = (score: number) => {
    if (score >= 80) return 'from-green-500 to-emerald-500';
    if (score >= 60) return 'from-yellow-500 to-orange-500';
    return 'from-red-500 to-pink-500';
  };

  return (
    <div className="bg-gray-50 dark:bg-gray-700 rounded-xl p-4 hover:shadow-lg transition-all duration-300 group">
      <div className="flex items-center space-x-3 mb-3">
        <div className="p-2 bg-white dark:bg-gray-600 rounded-lg shadow-sm group-hover:scale-110 transition-transform">
          <Icon className="w-5 h-5 text-gray-600 dark:text-gray-300" />
        </div>
        <div className="flex-1">
          <h4 className="font-semibold text-gray-900 dark:text-white">
            {title}
          </h4>
          <p className="text-xs text-gray-600 dark:text-gray-400">
            {description}
          </p>
        </div>
        <div className={`text-2xl font-bold ${getScoreColor(score)}`}>
          {score}
        </div>
      </div>
      
      <div className="relative">
        <div className="w-full bg-gray-200 dark:bg-gray-600 rounded-full h-2 overflow-hidden">
          <div
            className={`h-full bg-gradient-to-r ${getProgressColor(score)} transition-all duration-1000 ease-out`}
            style={{ width: `${score}%` }}
          />
        </div>
      </div>
    </div>
  );
};