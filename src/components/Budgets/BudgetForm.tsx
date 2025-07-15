import React, { useState } from 'react';
import { Budget } from '../../types';
import { X, Plus, Target } from 'lucide-react';

interface BudgetFormProps {
  onAddBudget: (budget: Omit<Budget, 'id' | 'spentAmount'>) => Promise<void>;
  onClose: () => void;
}

const categories = [
  // Essential Categories
  'Groceries', 'Rent', 'Mortgage', 'Transportation', 'Utilities', 'Insurance', 'Healthcare',
  // Lifestyle Categories
  'Dining Out', 'Entertainment', 'Shopping', 'Travel', 'Subscriptions', 'Personal Care',
  // Financial Categories
  'Debt Payment', 'Taxes', 'Retirement', 'Investments', 'Savings',
  // Home Categories
  'Home Maintenance', 'Home Improvement', 'Furniture', 'Appliances', 'Household Supplies',
  // Family Categories
  'Childcare', 'Education', 'Pet Expenses', 'Gifts', 'Charity', 'Family Support',
  // Miscellaneous
  'Hobbies', 'Fitness', 'Electronics', 'Clothing', 'Professional Services', 'Other'
];

export const BudgetForm: React.FC<BudgetFormProps> = ({ onAddBudget, onClose }) => {
  const [formData, setFormData] = useState({
    category: '',
    budgetAmount: '',
    period: 'monthly' as Budget['period'],
    alertThreshold: '80',
    rollover: false,
    startDate: new Date().toISOString().split('T')[0],
    endDate: new Date(new Date().getFullYear(), new Date().getMonth() + 1, 0).toISOString().split('T')[0]
  });
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.category) {
      newErrors.category = 'Category is required';
    }

    if (!formData.budgetAmount || parseFloat(formData.budgetAmount) <= 0) {
      newErrors.budgetAmount = 'Budget amount must be greater than 0';
    } else if (parseFloat(formData.budgetAmount) > 1000000) {
      newErrors.budgetAmount = 'Budget amount cannot exceed $1,000,000';
    }

    if (!formData.startDate) {
      newErrors.startDate = 'Start date is required';
    }

    if (!formData.endDate) {
      newErrors.endDate = 'End date is required';
    }

    if (formData.startDate && formData.endDate && new Date(formData.startDate) >= new Date(formData.endDate)) {
      newErrors.endDate = 'End date must be after start date';
    }

    const alertThreshold = parseInt(formData.alertThreshold);
    if (isNaN(alertThreshold) || alertThreshold < 1 || alertThreshold > 100) {
      newErrors.alertThreshold = 'Alert threshold must be between 1 and 100';
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
      await onAddBudget({
        category: formData.category,
        budgetAmount: parseFloat(formData.budgetAmount),
        spentAmount: 0,
        period: formData.period,
        alertThreshold: parseInt(formData.alertThreshold),
        rollover: formData.rollover,
        startDate: formData.startDate,
        endDate: formData.endDate
      });
      onClose();
    } catch (error) {
      console.error('Failed to create budget:', error);
    } finally {
      setLoading(false);
    }
  };

  const clearError = (field: string) => {
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  const updateEndDate = (period: Budget['period'], startDate: string) => {
    const start = new Date(startDate);
    let end: Date;

    switch (period) {
      case 'weekly':
        end = new Date(start);
        end.setDate(start.getDate() + 6);
        break;
      case 'yearly':
        end = new Date(start);
        end.setFullYear(start.getFullYear() + 1);
        end.setDate(end.getDate() - 1);
        break;
      case 'monthly':
      default:
        end = new Date(start.getFullYear(), start.getMonth() + 1, 0);
        break;
    }

    return end.toISOString().split('T')[0];
  };

  const handlePeriodChange = (period: Budget['period']) => {
    const newEndDate = updateEndDate(period, formData.startDate);
    setFormData(prev => ({
      ...prev,
      period,
      endDate: newEndDate
    }));
  };

  const handleStartDateChange = (startDate: string) => {
    const newEndDate = updateEndDate(formData.period, startDate);
    setFormData(prev => ({
      ...prev,
      startDate,
      endDate: newEndDate
    }));
    clearError('startDate');
    clearError('endDate');
  };

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-white dark:bg-gray-800 rounded-2xl p-8 w-full max-w-2xl mx-4 shadow-2xl border border-gray-200 dark:border-gray-700">
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center space-x-3">
            <div className="p-3 bg-gradient-to-r from-green-500 to-blue-600 rounded-xl">
              <Target className="w-6 h-6 text-white" />
            </div>
            <div>
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                Create Budget
              </h2>
              <p className="text-gray-600 dark:text-gray-400">
                Set spending limits for better financial control
              </p>
            </div>
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
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Category *
              </label>
              <select
                value={formData.category}
                onChange={(e) => {
                  setFormData(prev => ({ ...prev, category: e.target.value }));
                  clearError('category');
                }}
                className={`w-full px-4 py-3 border rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white transition-all ${
                  errors.category ? 'border-red-300 dark:border-red-600' : 'border-gray-300 dark:border-gray-600'
                }`}
              >
                <option value="">Select Category</option>
                <optgroup label="Essential">
                  <option value="Groceries">Groceries</option>
                  <option value="Rent">Rent</option>
                  <option value="Mortgage">Mortgage</option>
                  <option value="Transportation">Transportation</option>
                  <option value="Utilities">Utilities</option>
                  <option value="Insurance">Insurance</option>
                  <option value="Healthcare">Healthcare</option>
                </optgroup>
                <optgroup label="Lifestyle">
                  <option value="Dining Out">Dining Out</option>
                  <option value="Entertainment">Entertainment</option>
                  <option value="Shopping">Shopping</option>
                  <option value="Travel">Travel</option>
                  <option value="Subscriptions">Subscriptions</option>
                  <option value="Personal Care">Personal Care</option>
                </optgroup>
                <optgroup label="Financial">
                  <option value="Debt Payment">Debt Payment</option>
                  <option value="Taxes">Taxes</option>
                  <option value="Retirement">Retirement</option>
                  <option value="Investments">Investments</option>
                  <option value="Savings">Savings</option>
                </optgroup>
                <optgroup label="Home">
                  <option value="Home Maintenance">Home Maintenance</option>
                  <option value="Home Improvement">Home Improvement</option>
                  <option value="Furniture">Furniture</option>
                  <option value="Appliances">Appliances</option>
                  <option value="Household Supplies">Household Supplies</option>
                </optgroup>
                <optgroup label="Family">
                  <option value="Childcare">Childcare</option>
                  <option value="Education">Education</option>
                  <option value="Pet Expenses">Pet Expenses</option>
                  <option value="Gifts">Gifts</option>
                  <option value="Charity">Charity</option>
                  <option value="Family Support">Family Support</option>
                </optgroup>
                <optgroup label="Miscellaneous">
                  <option value="Hobbies">Hobbies</option>
                  <option value="Fitness">Fitness</option>
                  <option value="Electronics">Electronics</option>
                  <option value="Clothing">Clothing</option>
                  <option value="Professional Services">Professional Services</option>
                  <option value="Other">Other</option>
                </optgroup>
              </select>
              {errors.category && <p className="mt-1 text-sm text-red-600 dark:text-red-400">{errors.category}</p>}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Budget Amount *
              </label>
              <div className="relative">
                <span className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-500">$</span>
                <input
                  type="number"
                  step="0.01"
                  value={formData.budgetAmount}
                  onChange={(e) => {
                    setFormData(prev => ({ ...prev, budgetAmount: e.target.value }));
                    clearError('budgetAmount');
                  }}
                  className={`w-full pl-8 pr-4 py-3 border rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white transition-all ${
                    errors.budgetAmount ? 'border-red-300 dark:border-red-600' : 'border-gray-300 dark:border-gray-600'
                  }`}
                  placeholder="500.00"
                  min="0.01"
                  max="1000000"
                />
              </div>
              {errors.budgetAmount && <p className="mt-1 text-sm text-red-600 dark:text-red-400">{errors.budgetAmount}</p>}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Period
              </label>
              <select
                value={formData.period}
                onChange={(e) => handlePeriodChange(e.target.value as Budget['period'])}
                className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white transition-all"
              >
                <option value="weekly">Weekly</option>
                <option value="monthly">Monthly</option>
                <option value="yearly">Yearly</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Alert Threshold (%) *
              </label>
              <input
                type="number"
                min="1"
                max="100"
                value={formData.alertThreshold}
                onChange={(e) => {
                  setFormData(prev => ({ ...prev, alertThreshold: e.target.value }));
                  clearError('alertThreshold');
                }}
                className={`w-full px-4 py-3 border rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white transition-all ${
                  errors.alertThreshold ? 'border-red-300 dark:border-red-600' : 'border-gray-300 dark:border-gray-600'
                }`}
                placeholder="80"
              />
              {errors.alertThreshold && <p className="mt-1 text-sm text-red-600 dark:text-red-400">{errors.alertThreshold}</p>}
              <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
                Get notified when spending reaches this percentage
              </p>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Start Date *
              </label>
              <input
                type="date"
                value={formData.startDate}
                onChange={(e) => handleStartDateChange(e.target.value)}
                className={`w-full px-4 py-3 border rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white transition-all ${
                  errors.startDate ? 'border-red-300 dark:border-red-600' : 'border-gray-300 dark:border-gray-600'
                }`}
              />
              {errors.startDate && <p className="mt-1 text-sm text-red-600 dark:text-red-400">{errors.startDate}</p>}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                End Date *
              </label>
              <input
                type="date"
                value={formData.endDate}
                onChange={(e) => {
                  setFormData(prev => ({ ...prev, endDate: e.target.value }));
                  clearError('endDate');
                }}
                className={`w-full px-4 py-3 border rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white transition-all ${
                  errors.endDate ? 'border-red-300 dark:border-red-600' : 'border-gray-300 dark:border-gray-600'
                }`}
              />
              {errors.endDate && <p className="mt-1 text-sm text-red-600 dark:text-red-400">{errors.endDate}</p>}
            </div>

            <div className="md:col-span-2">
              <label className="flex items-center space-x-3 cursor-pointer">
                <input
                  type="checkbox"
                  checked={formData.rollover}
                  onChange={(e) => setFormData(prev => ({ ...prev, rollover: e.target.checked }))}
                  className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700"
                />
                <div>
                  <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                    Enable Rollover
                  </span>
                  <p className="text-xs text-gray-500 dark:text-gray-400">
                    Unused budget amount carries over to the next period
                  </p>
                </div>
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
              className="flex-1 px-6 py-3 bg-gradient-to-r from-green-500 to-blue-600 text-white rounded-xl hover:from-green-600 hover:to-blue-700 transition-all font-medium flex items-center justify-center space-x-2 shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? (
                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              ) : (
                <>
                  <Plus className="w-5 h-5" />
                  <span>Create Budget</span>
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};