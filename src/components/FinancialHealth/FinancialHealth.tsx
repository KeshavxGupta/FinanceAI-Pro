import React from 'react';
import { FinancialHealthScore } from '../../types';
import { HealthScoreCard } from './HealthScoreCard';
import { Shield, TrendingUp, PiggyBank, CreditCard, Target, AlertTriangle } from 'lucide-react';
import { mockFinancialHealth } from '../../services/mockData';

export const FinancialHealth: React.FC = () => {
  const healthScore = mockFinancialHealth;

  const getOverallHealthColor = (score: number) => {
    if (score >= 80) return 'from-green-500 to-emerald-500';
    if (score >= 60) return 'from-yellow-500 to-orange-500';
    return 'from-red-500 to-pink-500';
  };

  const getHealthStatus = (score: number) => {
    if (score >= 80) return { status: 'Excellent', icon: Shield, color: 'text-green-600 dark:text-green-400' };
    if (score >= 60) return { status: 'Good', icon: TrendingUp, color: 'text-yellow-600 dark:text-yellow-400' };
    return { status: 'Needs Attention', icon: AlertTriangle, color: 'text-red-600 dark:text-red-400' };
  };

  const healthStatus = getHealthStatus(healthScore.overall);
  const StatusIcon = healthStatus.icon;

  const recommendations = [
    {
      category: 'Emergency Fund',
      score: healthScore.emergency,
      recommendation: 'Build your emergency fund to 6 months of expenses',
      priority: 'high'
    },
    {
      category: 'Investing',
      score: healthScore.investing,
      recommendation: 'Increase your investment contributions by 5%',
      priority: 'medium'
    },
    {
      category: 'Budgeting',
      score: healthScore.budgeting,
      recommendation: 'Great job staying within your budgets!',
      priority: 'low'
    }
  ];

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="text-center">
        <h2 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-2">
          Financial Health Score
        </h2>
        <p className="text-gray-600 dark:text-gray-400">
          Get insights into your overall financial wellness
        </p>
      </div>

      {/* Overall Score */}
      <div className="bg-white dark:bg-gray-800 rounded-3xl p-8 shadow-xl border border-gray-200 dark:border-gray-700">
        <div className="text-center mb-8">
          <div className="relative inline-block">
            <div className="w-32 h-32 mx-auto mb-4">
              <svg className="w-full h-full transform -rotate-90" viewBox="0 0 100 100">
                <circle
                  cx="50"
                  cy="50"
                  r="40"
                  stroke="currentColor"
                  strokeWidth="8"
                  fill="none"
                  className="text-gray-200 dark:text-gray-700"
                />
                <circle
                  cx="50"
                  cy="50"
                  r="40"
                  stroke="url(#gradient)"
                  strokeWidth="8"
                  fill="none"
                  strokeDasharray={`${(healthScore.overall / 100) * 251.2} 251.2`}
                  strokeLinecap="round"
                  className="transition-all duration-1000 ease-out"
                />
                <defs>
                  <linearGradient id="gradient" x1="0%" y1="0%" x2="100%" y2="0%">
                    <stop offset="0%" className="text-blue-500" stopColor="currentColor" />
                    <stop offset="100%" className="text-purple-500" stopColor="currentColor" />
                  </linearGradient>
                </defs>
              </svg>
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="text-center">
                  <div className="text-3xl font-bold text-gray-900 dark:text-white">
                    {healthScore.overall}
                  </div>
                  <div className="text-sm text-gray-600 dark:text-gray-400">
                    out of 100
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className="flex items-center justify-center space-x-2 mb-2">
            <StatusIcon className={`w-6 h-6 ${healthStatus.color}`} />
            <h3 className={`text-2xl font-bold ${healthStatus.color}`}>
              {healthStatus.status}
            </h3>
          </div>
          <p className="text-gray-600 dark:text-gray-400">
            Your financial health is {healthStatus.status.toLowerCase()}. Keep up the good work!
          </p>
        </div>

        {/* Score Breakdown */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <HealthScoreCard
            title="Budgeting"
            score={healthScore.budgeting}
            icon={Target}
            description="How well you stick to your budgets"
          />
          <HealthScoreCard
            title="Saving"
            score={healthScore.saving}
            icon={PiggyBank}
            description="Your savings rate and consistency"
          />
          <HealthScoreCard
            title="Debt Management"
            score={healthScore.debt}
            icon={CreditCard}
            description="How you manage your debts"
          />
          <HealthScoreCard
            title="Investing"
            score={healthScore.investing}
            icon={TrendingUp}
            description="Your investment portfolio growth"
          />
          <HealthScoreCard
            title="Emergency Fund"
            score={healthScore.emergency}
            icon={Shield}
            description="Emergency fund adequacy"
          />
        </div>
      </div>

      {/* Recommendations */}
      <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-lg border border-gray-200 dark:border-gray-700">
        <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-6">
          Personalized Recommendations
        </h3>
        <div className="space-y-4">
          {recommendations.map((rec, index) => (
            <div
              key={index}
              className={`p-4 rounded-xl border-l-4 ${
                rec.priority === 'high'
                  ? 'bg-red-50 dark:bg-red-900/20 border-red-500'
                  : rec.priority === 'medium'
                  ? 'bg-yellow-50 dark:bg-yellow-900/20 border-yellow-500'
                  : 'bg-green-50 dark:bg-green-900/20 border-green-500'
              }`}
            >
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center space-x-2 mb-1">
                    <h4 className="font-semibold text-gray-900 dark:text-white">
                      {rec.category}
                    </h4>
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                      rec.priority === 'high'
                        ? 'bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-400'
                        : rec.priority === 'medium'
                        ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-400'
                        : 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400'
                    }`}>
                      {rec.priority.toUpperCase()}
                    </span>
                  </div>
                  <p className="text-gray-600 dark:text-gray-400">
                    {rec.recommendation}
                  </p>
                </div>
                <div className="text-right ml-4">
                  <div className="text-2xl font-bold text-gray-900 dark:text-white">
                    {rec.score}
                  </div>
                  <div className="text-xs text-gray-500">
                    /100
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};