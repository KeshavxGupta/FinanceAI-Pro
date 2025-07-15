import React, { useState } from 'react';
import { Goal } from '../../types';
import { X, Save } from 'lucide-react';

interface GoalEditFormProps {
  goal: Goal;
  onUpdateGoal: (goalData: Partial<Goal>) => Promise<void>;
  onClose: () => void;
}

const categories = [
  { value: 'emergency', label: 'Emergency Fund', icon: '🚨' },
  { value: 'vacation', label: 'Vacation', icon: '✈️' },
  { value: 'house', label: 'House', icon: '🏠' },
  { value: 'car', label: 'Car', icon: '🚗' },
  { value: 'education', label: 'Education', icon: '🎓' },
  { value: 'retirement', label: 'Retirement', icon: '🏖️' },
  { value: 'wedding', label: 'Wedding', icon: '💍' },
  { value: 'business', label: 'Business', icon: '💼' },
  { value: 'debt', label: 'Debt Payoff', icon: '💸' },
  { value: 'tech', label: 'Technology', icon: '📱' },
  { value: 'health', label: 'Health & Fitness', icon: '🏋️' },
  { value: 'gift', label: 'Gift', icon: '🎁' },
  { value: 'investment', label: 'Investment', icon: '📈' },
  { value: 'travel', label: 'Travel', icon: '🌎' },
  { value: 'hobby', label: 'Hobby', icon: '🎨' },
  { value: 'other', label: 'Other', icon: '🎯' }
];

export const GoalEditForm: React.FC<GoalEditFormProps> = ({ 
  goal, 
  onUpdateGoal, 
  onClose 
}) => {
  const [formData, setFormData] = useState({
    title: goal.title,
    description: goal.description,
    targetAmount: goal.targetAmount.toString(),
    currentAmount: goal.currentAmount.toString(),
    targetDate: goal.targetDate,
    category: goal.category,
    priority: goal.priority,
    isActive: goal.isActive
  });
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.title.trim()) {
      newErrors.title = 'Goal title is required';
    } else if (formData.title.trim().length < 3) {
      newErrors.title = 'Goal title must be at least 3 characters';
    }

    if (!formData.description.trim()) {
      newErrors.description = 'Description is required';
    } else if (formData.description.trim().length < 10) {
      newErrors.description = 'Description must be at least 10 characters';
    }

    if (!formData.targetAmount || parseFloat(formData.targetAmount) <= 0) {
      newErrors.targetAmount = 'Target amount must be greater than 0';
    } else if (parseFloat(formData.targetAmount) > 10000000) {
      newErrors.targetAmount = 'Target amount cannot exceed $10,000,000';
    }

    if (parseFloat(formData.currentAmount) < 0) {
      newErrors.currentAmount = 'Current amount cannot be negative';
    } else if (parseFloat(formData.currentAmount) > parseFloat(formData.targetAmount)) {
      newErrors.currentAmount = 'Current amount cannot exceed target amount';
    }

    if (!formData.targetDate) {
      newErrors.targetDate = 'Target date is required';
    } else if (new Date(formData.targetDate) <= new Date() && !goal.isActive) {
      // Only validate future date if this is a new goal or an active goal
      newErrors.targetDate = 'Target date must be in the future';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    setLoading(true);
    try {
      await onUpdateGoal({
        title: formData.title.trim(),
        description: formData.description.trim(),
        targetAmount: parseFloat(formData.targetAmount),
        currentAmount: parseFloat(formData.currentAmount),
        targetDate: formData.targetDate,
        category: formData.category as Goal['category'],
        priority: formData.priority as Goal['priority'],
        isActive: formData.isActive
      });
      onClose();
    } catch (error) {
      console.error('Failed to update goal:', error);
    } finally {
      setLoading(false);
    }
  };

  const clearError = (field: string) => {
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-white dark:bg-gray-800 rounded-2xl p-8 w-full max-w-2xl mx-4 shadow-2xl border border-gray-200 dark:border-gray-700 max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
              Edit Goal
            </h2>
            <p className="text-gray-600 dark:text-gray-400">
              Update your financial goal details
            </p>
          </div>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Goal Title
              </label>
              <input
                type="text"
                value={formData.title}
                onChange={(e) => {
                  setFormData(prev => ({ ...prev, title: e.target.value }));
                  clearError('title');
                }}
                className={`w-full px-4 py-3 border rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white transition-all ${
                  errors.title ? 'border-red-300 dark:border-red-600' : 'border-gray-300 dark:border-gray-600'
                }`}
                required
              />
              {errors.title && <p className="mt-1 text-sm text-red-600 dark:text-red-400">{errors.title}</p>}
            </div>

            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Description
              </label>
              <textarea
                value={formData.description}
                onChange={(e) => {
                  setFormData(prev => ({ ...prev, description: e.target.value }));
                  clearError('description');
                }}
                className={`w-full px-4 py-3 border rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white transition-all ${
                  errors.description ? 'border-red-300 dark:border-red-600' : 'border-gray-300 dark:border-gray-600'
                }`}
                rows={3}
                required
              />
              {errors.description && <p className="mt-1 text-sm text-red-600 dark:text-red-400">{errors.description}</p>}
              <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
                {formData.description.length}/500 characters
              </p>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Target Amount
              </label>
              <div className="relative">
                <span className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-500">$</span>
                <input
                  type="number"
                  step="0.01"
                  value={formData.targetAmount}
                  onChange={(e) => {
                    setFormData(prev => ({ ...prev, targetAmount: e.target.value }));
                    clearError('targetAmount');
                  }}
                  className={`w-full pl-8 pr-4 py-3 border rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white transition-all ${
                    errors.targetAmount ? 'border-red-300 dark:border-red-600' : 'border-gray-300 dark:border-gray-600'
                  }`}
                  required
                />
              </div>
              {errors.targetAmount && <p className="mt-1 text-sm text-red-600 dark:text-red-400">{errors.targetAmount}</p>}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Current Amount
              </label>
              <div className="relative">
                <span className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-500">$</span>
                <input
                  type="number"
                  step="0.01"
                  value={formData.currentAmount}
                  onChange={(e) => {
                    setFormData(prev => ({ ...prev, currentAmount: e.target.value }));
                    clearError('currentAmount');
                  }}
                  className={`w-full pl-8 pr-4 py-3 border rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white transition-all ${
                    errors.currentAmount ? 'border-red-300 dark:border-red-600' : 'border-gray-300 dark:border-gray-600'
                  }`}
                />
              </div>
              {errors.currentAmount && <p className="mt-1 text-sm text-red-600 dark:text-red-400">{errors.currentAmount}</p>}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Target Date
              </label>
              <input
                type="date"
                value={formData.targetDate}
                onChange={(e) => {
                  setFormData(prev => ({ ...prev, targetDate: e.target.value }));
                  clearError('targetDate');
                }}
                className={`w-full px-4 py-3 border rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white transition-all ${
                  errors.targetDate ? 'border-red-300 dark:border-red-600' : 'border-gray-300 dark:border-gray-600'
                }`}
                required
              />
              {errors.targetDate && <p className="mt-1 text-sm text-red-600 dark:text-red-400">{errors.targetDate}</p>}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Category
              </label>
              <select
                value={formData.category}
                onChange={(e) => setFormData(prev => ({ ...prev, category: e.target.value as Goal['category'] }))}
                className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white transition-all"
                required
              >
                {categories.map(category => (
                  <option key={category.value} value={category.value}>
                    {category.icon} {category.label}
                  </option>
                ))}
              </select>
            </div>

            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
                Priority Level
              </label>
              <div className="flex space-x-4">
                {(['low', 'medium', 'high'] as const).map((priority) => (
                  <label key={priority} className="flex items-center cursor-pointer">
                    <input
                      type="radio"
                      value={priority}
                      checked={formData.priority === priority}
                      onChange={(e) => setFormData(prev => ({ ...prev, priority: e.target.value as Goal['priority'] }))}
                      className="sr-only"
                    />
                    <div className={`px-4 py-2 rounded-lg border-2 transition-all ${
                      formData.priority === priority
                        ? priority === 'high'
                          ? 'border-red-500 bg-red-50 text-red-700 dark:bg-red-900/20 dark:text-red-400'
                          : priority === 'medium'
                          ? 'border-yellow-500 bg-yellow-50 text-yellow-700 dark:bg-yellow-900/20 dark:text-yellow-400'
                          : 'border-green-500 bg-green-50 text-green-700 dark:bg-green-900/20 dark:text-green-400'
                        : 'border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:border-gray-400'
                    }`}>
                      {priority.charAt(0).toUpperCase() + priority.slice(1)}
                    </div>
                  </label>
                ))}
              </div>
            </div>

            <div className="md:col-span-2">
              <label className="flex items-center space-x-3 cursor-pointer">
                <input
                  type="checkbox"
                  checked={formData.isActive}
                  onChange={(e) => setFormData(prev => ({ ...prev, isActive: e.target.checked }))}
                  className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700"
                />
                <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                  Goal is active
                </span>
              </label>
            </div>
          </div>

          <div className="flex space-x-4 pt-6 border-t border-gray-200 dark:border-gray-700">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-6 py-3 border border-gray-300 dark:border-gray-600 rounded-xl text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors font-medium"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="flex-1 px-6 py-3 bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-xl hover:from-blue-600 hover:to-purple-700 transition-all font-medium flex items-center justify-center space-x-2 shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? (
                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              ) : (
                <>
                  <Save className="w-5 h-5" />
                  <span>Update Goal</span>
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};