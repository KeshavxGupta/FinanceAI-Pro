import React, { useState } from 'react';
import { Budget } from '../../types';
import { AlertTriangle, TrendingUp, TrendingDown, Edit, Trash2, DollarSign, Calendar, Target, Activity } from 'lucide-react';
import { BudgetEditForm } from './BudgetEditForm';
import { BudgetDeleteModal } from './BudgetDeleteModal';
import { format, differenceInDays } from 'date-fns';

interface BudgetCardProps {
  budget: Budget & { 
    spentAmount: number; 
    utilization: number; 
    remainingAmount: number; 
    transactionCount: number; 
  };
  onUpdate: (id: string, data: Partial<Budget>) => Promise<void>;
  onDelete: (id: string) => Promise<void>;
}

export const BudgetCard: React.FC<BudgetCardProps> = ({ budget, onUpdate, onDelete }) => {
  const [showEditForm, setShowEditForm] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  
  const isOverBudget = budget.utilization > 100;
  const isNearLimit = budget.utilization > budget.alertThreshold && budget.utilization <= 100;
  const isOnTrack = budget.utilization <= budget.alertThreshold;

  const daysRemaining = differenceInDays(new Date(budget.endDate), new Date());
  const totalDays = differenceInDays(new Date(budget.endDate), new Date(budget.startDate));
  const daysPassed = totalDays - daysRemaining;
  const timeProgress = totalDays > 0 ? (daysPassed / totalDays) * 100 : 0;

  const getProgressColor = () => {
    if (isOverBudget) return 'from-red-500 to-red-600';
    if (isNearLimit) return 'from-yellow-500 to-orange-500';
    return 'from-green-500 to-emerald-500';
  };

  const getStatusIcon = () => {
    if (isOverBudget) return <AlertTriangle className="w-5 h-5 text-red-500" />;
    if (isNearLimit) return <TrendingUp className="w-5 h-5 text-yellow-500" />;
    return <TrendingDown className="w-5 h-5 text-green-500" />;
  };

  const getCardBorderColor = () => {
    if (isOverBudget) return 'border-red-200 dark:border-red-800 bg-gradient-to-br from-red-50 to-red-100 dark:from-red-900/20 dark:to-red-800/20';
    if (isNearLimit) return 'border-yellow-200 dark:border-yellow-800 bg-gradient-to-br from-yellow-50 to-yellow-100 dark:from-yellow-900/20 dark:to-yellow-800/20';
    return 'border-green-200 dark:border-green-800 bg-gradient-to-br from-green-50 to-green-100 dark:from-green-900/20 dark:to-green-800/20';
  };

  const getCategoryIcon = () => {
    const icons: Record<string, string> = {
      'Groceries': '🛒',
      'Transportation': '🚗',
      'Entertainment': '🎬',
      'Dining Out': '🍽️',
      'Shopping': '🛍️',
      'Utilities': '⚡',
      'Healthcare': '🏥',
      'Education': '📚',
      'Insurance': '🛡️',
      'Other': '📊'
    };
    return icons[budget.category] || '💰';
  };

  const handleEdit = () => {
    setShowEditForm(true);
  };

  const handleDelete = () => {
    setShowDeleteModal(true);
  };

  const handleUpdateBudget = async (data: Partial<Budget>) => {
    await onUpdate(budget.id, data);
    setShowEditForm(false);
  };

  const handleDeleteBudget = async () => {
    await onDelete(budget.id);
    setShowDeleteModal(false);
  };

  const dailyBudget = totalDays > 0 ? budget.budgetAmount / totalDays : 0;
  const dailySpending = daysPassed > 0 ? budget.spentAmount / daysPassed : 0;
  const projectedSpending = dailySpending * totalDays;

  return (
    <>
      <div className={`${getCardBorderColor()} rounded-2xl p-6 border-2 transition-all duration-300 hover:shadow-xl hover:scale-[1.02] group relative overflow-hidden`}>
        {/* Background Pattern */}
        <div className="absolute inset-0 opacity-5">
          <div className="absolute top-0 right-0 w-32 h-32 transform rotate-12 translate-x-8 -translate-y-8">
            <div className="text-6xl">{getCategoryIcon()}</div>
          </div>
        </div>

        {/* Header */}
        <div className="relative z-10 flex items-start justify-between mb-6">
          <div className="flex items-center space-x-3">
            <div className="text-3xl">{getCategoryIcon()}</div>
            <div>
              <h3 className="text-xl font-bold text-gray-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                {budget.category}
              </h3>
              <p className="text-sm text-gray-600 dark:text-gray-400 capitalize">
                {budget.period} budget
              </p>
              <div className="flex items-center space-x-2 mt-1">
                <Activity className="w-3 h-3 text-gray-500" />
                <span className="text-xs text-gray-500 dark:text-gray-400">
                  {budget.transactionCount} transactions
                </span>
              </div>
            </div>
          </div>
          <div className="flex items-center space-x-2">
            {getStatusIcon()}
            <div className="opacity-0 group-hover:opacity-100 transition-opacity flex space-x-1">
              <button
                onClick={handleEdit}
                className="p-2 text-gray-400 hover:text-blue-500 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded-lg transition-colors"
                title="Edit budget"
              >
                <Edit className="w-4 h-4" />
              </button>
              <button
                onClick={handleDelete}
                className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors"
                title="Delete budget"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>

        {/* Budget Amount and Progress */}
        <div className="relative z-10 space-y-4">
          <div className="flex justify-between items-center">
            <div>
              <p className="text-sm text-gray-600 dark:text-gray-400">Spent</p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">
                ${budget.spentAmount.toLocaleString()}
              </p>
            </div>
            <div className="text-right">
              <p className="text-sm text-gray-600 dark:text-gray-400">Budget</p>
              <p className="text-xl font-semibold text-gray-700 dark:text-gray-300">
                ${budget.budgetAmount.toLocaleString()}
              </p>
            </div>
          </div>

          {/* Progress Bar */}
          <div className="relative">
            <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-4 overflow-hidden">
              <div
                className={`h-full bg-gradient-to-r ${getProgressColor()} transition-all duration-500 ease-out relative`}
                style={{ width: `${Math.min(budget.utilization, 100)}%` }}
              >
                <div className="absolute inset-0 bg-white/20 animate-pulse"></div>
              </div>
            </div>
            {budget.utilization > 100 && (
              <div className="absolute -top-1 -right-1">
                <div className="w-6 h-6 bg-red-500 rounded-full flex items-center justify-center animate-pulse">
                  <AlertTriangle className="w-3 h-3 text-white" />
                </div>
              </div>
            )}
          </div>

          {/* Utilization and Remaining */}
          <div className="flex justify-between items-center">
            <span className={`text-sm font-medium ${
              isOverBudget 
                ? 'text-red-600 dark:text-red-400' 
                : isNearLimit
                ? 'text-yellow-600 dark:text-yellow-400'
                : 'text-green-600 dark:text-green-400'
            }`}>
              {budget.utilization.toFixed(1)}% used
            </span>
            <span className={`text-sm font-semibold ${
              budget.remainingAmount >= 0
                ? 'text-green-600 dark:text-green-400' 
                : 'text-red-600 dark:text-red-400'
            }`}>
              {budget.remainingAmount >= 0 
                ? `$${budget.remainingAmount.toLocaleString()} left`
                : `$${Math.abs(budget.remainingAmount).toLocaleString()} over`
              }
            </span>
          </div>

          {/* Time Progress */}
          <div className="pt-4 border-t border-gray-200 dark:border-gray-700">
            <div className="flex justify-between items-center mb-2">
              <span className="text-xs text-gray-600 dark:text-gray-400">Time Progress</span>
              <span className="text-xs text-gray-600 dark:text-gray-400">
                {daysRemaining > 0 ? `${daysRemaining} days left` : 'Period ended'}
              </span>
            </div>
            <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
              <div 
                className="bg-blue-400 h-2 rounded-full transition-all duration-500"
                style={{ width: `${Math.min(timeProgress, 100)}%` }}
              />
            </div>
          </div>

          {/* Period and Alert Threshold */}
          <div className="flex justify-between text-xs text-gray-500 dark:text-gray-400">
            <div className="flex items-center space-x-1">
              <Calendar className="w-3 h-3" />
              <span>{format(new Date(budget.startDate), 'MMM dd')} - {format(new Date(budget.endDate), 'MMM dd')}</span>
            </div>
            <span>Alert at {budget.alertThreshold}%</span>
          </div>

          {/* Daily Spending Insights */}
          <div className="bg-white/50 dark:bg-gray-800/50 rounded-lg p-3 space-y-2">
            <div className="flex justify-between text-xs">
              <span className="text-gray-600 dark:text-gray-400">Daily budget:</span>
              <span className="font-medium text-gray-900 dark:text-white">${dailyBudget.toFixed(2)}</span>
            </div>
            <div className="flex justify-between text-xs">
              <span className="text-gray-600 dark:text-gray-400">Daily spending:</span>
              <span className={`font-medium ${
                dailySpending > dailyBudget ? 'text-red-600 dark:text-red-400' : 'text-green-600 dark:text-green-400'
              }`}>
                ${dailySpending.toFixed(2)}
              </span>
            </div>
            {projectedSpending > 0 && (
              <div className="flex justify-between text-xs">
                <span className="text-gray-600 dark:text-gray-400">Projected total:</span>
                <span className={`font-medium ${
                  projectedSpending > budget.budgetAmount ? 'text-red-600 dark:text-red-400' : 'text-blue-600 dark:text-blue-400'
                }`}>
                  ${projectedSpending.toFixed(2)}
                </span>
              </div>
            )}
          </div>

          {/* Status Messages */}
          {isOverBudget && (
            <div className="mt-4 p-3 bg-red-50 dark:bg-red-900/20 rounded-lg border border-red-200 dark:border-red-800">
              <p className="text-sm text-red-700 dark:text-red-300 flex items-center space-x-2">
                <AlertTriangle className="w-4 h-4" />
                <span>Budget exceeded by ${Math.abs(budget.remainingAmount).toFixed(2)}</span>
              </p>
            </div>
          )}

          {isNearLimit && !isOverBudget && (
            <div className="mt-4 p-3 bg-yellow-50 dark:bg-yellow-900/20 rounded-lg border border-yellow-200 dark:border-yellow-800">
              <p className="text-sm text-yellow-700 dark:text-yellow-300 flex items-center space-x-2">
                <TrendingUp className="w-4 h-4" />
                <span>Approaching budget limit ({budget.alertThreshold}% threshold reached)</span>
              </p>
            </div>
          )}

          {isOnTrack && (
            <div className="mt-4 p-3 bg-green-50 dark:bg-green-900/20 rounded-lg border border-green-200 dark:border-green-800">
              <p className="text-sm text-green-700 dark:text-green-300 flex items-center space-x-2">
                <Target className="w-4 h-4" />
                <span>On track! Keep up the good spending habits.</span>
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Modals */}
      {showEditForm && (
        <BudgetEditForm
          budget={budget}
          onUpdateBudget={handleUpdateBudget}
          onClose={() => setShowEditForm(false)}
        />
      )}

      {showDeleteModal && (
        <BudgetDeleteModal
          budget={budget}
          onDeleteBudget={handleDeleteBudget}
          onClose={() => setShowDeleteModal(false)}
        />
      )}
    </>
  );
};