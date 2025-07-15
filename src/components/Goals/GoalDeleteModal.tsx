import React, { useState } from 'react';
import { Goal } from '../../types';
import { X, Trash2, AlertTriangle, Target, Calendar, TrendingUp } from 'lucide-react';
import { format, differenceInDays } from 'date-fns';

interface GoalDeleteModalProps {
  goal: Goal;
  onDeleteGoal: () => Promise<void>;
  onClose: () => void;
}

export const GoalDeleteModal: React.FC<GoalDeleteModalProps> = ({ 
  goal, 
  onDeleteGoal, 
  onClose 
}) => {
  const [loading, setLoading] = useState(false);
  const [confirmText, setConfirmText] = useState('');

  const confirmationText = goal.title;
  const progress = goal.targetAmount > 0 ? (goal.currentAmount / goal.targetAmount) * 100 : 0;
  const daysLeft = differenceInDays(new Date(goal.targetDate), new Date());
  const isCompleted = progress >= 100;

  const handleDelete = async () => {
    if (confirmText !== confirmationText) {
      return;
    }

    setLoading(true);
    try {
      await onDeleteGoal();
      onClose();
    } catch (error) {
      console.error('Failed to delete goal:', error);
    } finally {
      setLoading(false);
    }
  };

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
      case 'high': return 'bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-400';
      case 'medium': return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-400';
      default: return 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400';
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-white dark:bg-gray-800 rounded-2xl p-8 w-full max-w-md mx-4 shadow-2xl border border-gray-200 dark:border-gray-700">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center space-x-3">
            <div className="p-3 bg-red-100 dark:bg-red-900/20 rounded-xl">
              <Trash2 className="w-6 h-6 text-red-600 dark:text-red-400" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-gray-900 dark:text-white">
                Delete Goal
              </h2>
              <p className="text-gray-600 dark:text-gray-400 text-sm">
                This action cannot be undone
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Goal Summary */}
        <div className="mb-6 p-4 bg-gray-50 dark:bg-gray-700 rounded-xl">
          <div className="flex items-center space-x-3 mb-3">
            <div className="text-2xl">{getCategoryIcon()}</div>
            <div>
              <h3 className="font-bold text-gray-900 dark:text-white">{goal.title}</h3>
              <p className="text-sm text-gray-600 dark:text-gray-400 line-clamp-2">{goal.description}</p>
            </div>
          </div>
          
          <div className="grid grid-cols-2 gap-4 text-sm mb-3">
            <div>
              <p className="text-gray-600 dark:text-gray-400">Target Amount</p>
              <p className="font-semibold text-gray-900 dark:text-white">${goal.targetAmount.toLocaleString()}</p>
            </div>
            <div>
              <p className="text-gray-600 dark:text-gray-400">Current Amount</p>
              <p className="font-semibold text-gray-900 dark:text-white">${goal.currentAmount.toLocaleString()}</p>
            </div>
            <div>
              <p className="text-gray-600 dark:text-gray-400">Progress</p>
              <div className="flex items-center space-x-2">
                <p className={`font-semibold ${
                  progress >= 100 ? 'text-green-600 dark:text-green-400' : 'text-blue-600 dark:text-blue-400'
                }`}>
                  {progress.toFixed(1)}%
                </p>
                {isCompleted && <span className="text-xs">🎉</span>}
              </div>
            </div>
            <div>
              <p className="text-gray-600 dark:text-gray-400">Days Left</p>
              <p className={`font-semibold ${
                daysLeft < 0 ? 'text-red-600 dark:text-red-400' : 'text-gray-900 dark:text-white'
              }`}>
                {daysLeft < 0 ? `${Math.abs(daysLeft)} overdue` : daysLeft}
              </p>
            </div>
          </div>

          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2 text-xs text-gray-500 dark:text-gray-400">
              <Calendar className="w-3 h-3" />
              <span>Target: {format(new Date(goal.targetDate), 'MMM dd, yyyy')}</span>
            </div>
            <span className={`px-2 py-1 rounded-full text-xs font-medium ${getPriorityColor()}`}>
              {goal.priority.toUpperCase()}
            </span>
          </div>

          {/* Progress Bar */}
          <div className="mt-3">
            <div className="w-full bg-gray-200 dark:bg-gray-600 rounded-full h-2">
              <div 
                className={`h-2 rounded-full transition-all duration-300 ${
                  progress >= 100 ? 'bg-green-500' : 'bg-blue-500'
                }`}
                style={{ width: `${Math.min(progress, 100)}%` }}
              />
            </div>
          </div>
        </div>

        {/* Warning */}
        <div className="mb-6 p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-xl">
          <div className="flex items-start space-x-3">
            <AlertTriangle className="w-5 h-5 text-red-500 mt-0.5 flex-shrink-0" />
            <div>
              <h4 className="font-medium text-red-900 dark:text-red-100 mb-1">
                Permanent Deletion
              </h4>
              <p className="text-sm text-red-700 dark:text-red-300">
                This will permanently remove this goal and all progress tracking. 
                {isCompleted && " You're about to delete a completed goal!"} 
                {progress > 50 && !isCompleted && " You've made significant progress on this goal."}
              </p>
            </div>
          </div>
        </div>

        {/* Confirmation Input */}
        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Type <span className="font-mono bg-gray-100 dark:bg-gray-700 px-2 py-1 rounded text-red-600 dark:text-red-400">{confirmationText}</span> to confirm deletion:
          </label>
          <input
            type="text"
            value={confirmText}
            onChange={(e) => setConfirmText(e.target.value)}
            className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-red-500 focus:border-transparent dark:bg-gray-700 dark:text-white transition-all"
            placeholder={`Type "${confirmationText}" here`}
          />
        </div>

        {/* Action Buttons */}
        <div className="flex space-x-3">
          <button
            type="button"
            onClick={onClose}
            className="flex-1 px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-xl text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors font-medium"
          >
            Cancel
          </button>
          <button
            onClick={handleDelete}
            disabled={loading || confirmText !== confirmationText}
            className="flex-1 px-4 py-3 bg-red-500 text-white rounded-xl hover:bg-red-600 transition-colors font-medium flex items-center justify-center space-x-2 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? (
              <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
            ) : (
              <>
                <Trash2 className="w-4 h-4" />
                <span>Delete Goal</span>
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};