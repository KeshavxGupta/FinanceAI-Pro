import React, { useState } from 'react';
import { Goal } from '../../types';
import { Target, Calendar, TrendingUp, Flag, Edit, Trash2, Plus, Minus } from 'lucide-react';
import { format, differenceInDays } from 'date-fns';
import { GoalEditForm } from './GoalEditForm';
import { GoalDeleteModal } from './GoalDeleteModal';

interface GoalCardProps {
  goal: Goal;
  onUpdate: (id: string, data: Partial<Goal>) => Promise<void>;
  onDelete: (id: string) => Promise<void>;
  onUpdateProgress: (id: string, amount: number) => Promise<void>;
}

export const GoalCard: React.FC<GoalCardProps> = ({ goal, onUpdate, onDelete, onUpdateProgress }) => {
  const [showEditForm, setShowEditForm] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showProgressForm, setShowProgressForm] = useState(false);
  const [progressAmount, setProgressAmount] = useState('');
  const [progressLoading, setProgressLoading] = useState(false);
  
  const progress = goal.targetAmount > 0 ? (goal.currentAmount / goal.targetAmount) * 100 : 0;
  const daysLeft = differenceInDays(new Date(goal.targetDate), new Date());
  const isOverdue = daysLeft < 0;
  const isNearDeadline = daysLeft <= 30 && daysLeft > 0;
  const isCompleted = progress >= 100;

  const getCategoryIcon = () => {
    switch (goal.category) {
      case 'emergency': return '🚨';
      case 'vacation': return '✈️';
      case 'house': return '🏠';
      case 'car': return '🚗';
      case 'education': return '🎓';
      case 'retirement': return '🏖️';
      default: return '🎯';
    }
  };

  const getPriorityColor = () => {
    switch (goal.priority) {
      case 'high': return 'border-red-200 dark:border-red-800 bg-gradient-to-br from-red-50 to-red-100 dark:from-red-900/20 dark:to-red-800/20';
      case 'medium': return 'border-yellow-200 dark:border-yellow-800 bg-gradient-to-br from-yellow-50 to-yellow-100 dark:from-yellow-900/20 dark:to-yellow-800/20';
      default: return 'border-green-200 dark:border-green-800 bg-gradient-to-br from-green-50 to-green-100 dark:from-green-900/20 dark:to-green-800/20';
    }
  };

  const getProgressColor = () => {
    if (progress >= 100) return 'from-green-500 to-emerald-500';
    if (progress >= 75) return 'from-blue-500 to-cyan-500';
    if (progress >= 50) return 'from-yellow-500 to-orange-500';
    return 'from-red-500 to-pink-500';
  };

  const handleEdit = () => {
    setShowEditForm(true);
  };

  const handleDelete = () => {
    setShowDeleteModal(true);
  };

  const handleUpdateGoal = async (data: Partial<Goal>) => {
    await onUpdate(goal.id, data);
    setShowEditForm(false);
  };

  const handleDeleteGoal = async () => {
    await onDelete(goal.id);
    setShowDeleteModal(false);
  };

  const handleProgressUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    const amount = parseFloat(progressAmount);
    
    if (isNaN(amount) || amount === 0) {
      return;
    }

    // Validate the new amount won't be negative
    if (goal.currentAmount + amount < 0) {
      alert('Cannot subtract more than the current amount');
      return;
    }

    setProgressLoading(true);
    try {
      await onUpdateProgress(goal.id, amount);
      setProgressAmount('');
      setShowProgressForm(false);
    } catch (error) {
      console.error('Failed to update progress:', error);
    } finally {
      setProgressLoading(false);
    }
  };

  const quickAddAmount = async (amount: number) => {
    setProgressLoading(true);
    try {
      await onUpdateProgress(goal.id, amount);
    } catch (error) {
      console.error('Failed to update progress:', error);
    } finally {
      setProgressLoading(false);
    }
  };

  return (
    <>
      <div className={`rounded-2xl p-6 border-2 ${getPriorityColor()} transition-all duration-300 hover:shadow-xl hover:scale-[1.02] group`}>
        {/* Header */}
        <div className="flex items-start justify-between mb-4">
          <div className="flex items-center space-x-3">
            <div className="text-2xl">{getCategoryIcon()}</div>
            <div>
              <h3 className="text-xl font-bold text-gray-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                {goal.title}
              </h3>
              <p className="text-sm text-gray-600 dark:text-gray-400 line-clamp-2">
                {goal.description}
              </p>
            </div>
          </div>
          <div className="flex items-center space-x-2 opacity-0 group-hover:opacity-100 transition-opacity">
            <button
              onClick={() => setShowProgressForm(true)}
              disabled={progressLoading}
              className="p-2 text-gray-400 hover:text-green-500 hover:bg-green-50 dark:hover:bg-green-900/20 rounded-lg transition-colors disabled:opacity-50"
              title="Update progress"
            >
              <Plus className="w-4 h-4" />
            </button>
            <button
              onClick={handleEdit}
              className="p-2 text-gray-400 hover:text-blue-500 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded-lg transition-colors"
              title="Edit goal"
            >
              <Edit className="w-4 h-4" />
            </button>
            <button
              onClick={handleDelete}
              className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors"
              title="Delete goal"
            >
              <Trash2 className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Progress Section */}
        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <span className="text-sm font-medium text-gray-600 dark:text-gray-400">Progress</span>
            <span className="text-sm font-bold text-gray-900 dark:text-white">
              {progress.toFixed(1)}%
            </span>
          </div>

          {/* Progress Bar */}
          <div className="relative">
            <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-3 overflow-hidden">
              <div
                className={`h-full bg-gradient-to-r ${getProgressColor()} transition-all duration-500 ease-out relative`}
                style={{ width: `${Math.min(progress, 100)}%` }}
              >
                <div className="absolute inset-0 bg-white/20 animate-pulse"></div>
              </div>
            </div>
            {progress >= 100 && (
              <div className="absolute -top-1 -right-1">
                <div className="w-5 h-5 bg-green-500 rounded-full flex items-center justify-center">
                  <Target className="w-3 h-3 text-white" />
                </div>
              </div>
            )}
          </div>

          {/* Amount Info */}
          <div className="flex justify-between items-center">
            <div>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">
                ${goal.currentAmount.toLocaleString()}
              </p>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                of ${goal.targetAmount.toLocaleString()}
              </p>
            </div>
            <div className="text-right">
              <p className="text-lg font-semibold text-gray-700 dark:text-gray-300">
                ${(goal.targetAmount - goal.currentAmount).toLocaleString()}
              </p>
              <p className="text-sm text-gray-600 dark:text-gray-400">remaining</p>
            </div>
          </div>

          {/* Quick Actions */}
          <div className="flex space-x-2">
            <button
              onClick={() => quickAddAmount(50)}
              disabled={progressLoading}
              className="flex-1 py-2 px-3 bg-green-100 hover:bg-green-200 dark:bg-green-900/20 dark:hover:bg-green-900/30 text-green-700 dark:text-green-400 rounded-lg text-sm font-medium transition-colors disabled:opacity-50"
            >
              +$50
            </button>
            <button
              onClick={() => quickAddAmount(100)}
              disabled={progressLoading}
              className="flex-1 py-2 px-3 bg-blue-100 hover:bg-blue-200 dark:bg-blue-900/20 dark:hover:bg-blue-900/30 text-blue-700 dark:text-blue-400 rounded-lg text-sm font-medium transition-colors disabled:opacity-50"
            >
              +$100
            </button>
            <button
              onClick={() => quickAddAmount(500)}
              disabled={progressLoading}
              className="flex-1 py-2 px-3 bg-purple-100 hover:bg-purple-200 dark:bg-purple-900/20 dark:hover:bg-purple-900/30 text-purple-700 dark:text-purple-400 rounded-lg text-sm font-medium transition-colors disabled:opacity-50"
            >
              +$500
            </button>
          </div>

          {/* Timeline */}
          <div className="flex items-center justify-between pt-4 border-t border-gray-200 dark:border-gray-700">
            <div className="flex items-center space-x-2">
              <Calendar className="w-4 h-4 text-gray-500" />
              <span className="text-sm text-gray-600 dark:text-gray-400">
                Target: {format(new Date(goal.targetDate), 'MMM dd, yyyy')}
              </span>
            </div>
            <div className={`flex items-center space-x-1 px-2 py-1 rounded-full text-xs font-medium ${
              isOverdue 
                ? 'bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-400'
                : isNearDeadline
                ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-400'
                : 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400'
            }`}>
              <Flag className="w-3 h-3" />
              <span>
                {isOverdue 
                  ? `${Math.abs(daysLeft)} days overdue`
                  : `${daysLeft} days left`
                }
              </span>
            </div>
          </div>

          {/* Priority Badge */}
          <div className="flex items-center justify-between">
            <span className={`px-3 py-1 rounded-full text-xs font-medium ${
              goal.priority === 'high' 
                ? 'bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-400'
                : goal.priority === 'medium'
                ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-400'
                : 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400'
            }`}>
              {goal.priority.toUpperCase()} PRIORITY
            </span>
            {isCompleted && (
              <span className="px-3 py-1 bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400 rounded-full text-xs font-medium">
                🎉 COMPLETED
              </span>
            )}
          </div>
        </div>
      </div>

      {/* Progress Update Form */}
      {showProgressForm && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 w-full max-w-md shadow-2xl border border-gray-200 dark:border-gray-700">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
              Update Progress
            </h3>
            <form onSubmit={handleProgressUpdate} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Amount to Add/Subtract
                </label>
                <div className="relative">
                  <span className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-500">$</span>
                  <input
                    type="number"
                    step="0.01"
                    value={progressAmount}
                    onChange={(e) => setProgressAmount(e.target.value)}
                    className="w-full pl-8 pr-4 py-3 border border-gray-300 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                    placeholder="100.00"
                    required
                  />
                </div>
                <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                  Use negative values to subtract from progress
                </p>
                <p className="text-xs text-gray-600 dark:text-gray-300 mt-1">
                  Current: ${goal.currentAmount.toLocaleString()}
                </p>
              </div>
              <div className="flex space-x-3">
                <button
                  type="button"
                  onClick={() => setShowProgressForm(false)}
                  className="flex-1 px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={progressLoading}
                  className="flex-1 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
                >
                  {progressLoading ? (
                    <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  ) : (
                    'Update'
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modals */}
      {showEditForm && (
        <GoalEditForm
          goal={goal}
          onUpdateGoal={handleUpdateGoal}
          onClose={() => setShowEditForm(false)}
        />
      )}

      {showDeleteModal && (
        <GoalDeleteModal
          goal={goal}
          onDeleteGoal={handleDeleteGoal}
          onClose={() => setShowDeleteModal(false)}
        />
      )}
    </>
  );
};