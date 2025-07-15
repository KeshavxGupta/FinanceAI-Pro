import React, { useState } from 'react';
import { Budget } from '../../types';
import { X, Trash2, AlertTriangle, Target, Calendar, DollarSign } from 'lucide-react';
import { format } from 'date-fns';

interface BudgetDeleteModalProps {
  budget: Budget & { 
    spentAmount: number; 
    utilization: number; 
    remainingAmount: number; 
    transactionCount: number; 
  };
  onDeleteBudget: () => Promise<void>;
  onClose: () => void;
}

export const BudgetDeleteModal: React.FC<BudgetDeleteModalProps> = ({ 
  budget, 
  onDeleteBudget, 
  onClose 
}) => {
  const [loading, setLoading] = useState(false);
  const [confirmText, setConfirmText] = useState('');

  const confirmationText = budget.category;

  const handleDelete = async () => {
    if (confirmText !== confirmationText) {
      return;
    }

    setLoading(true);
    try {
      await onDeleteBudget();
      onClose();
    } catch (error) {
      console.error('Failed to delete budget:', error);
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = () => {
    if (budget.utilization > 100) return 'text-red-600 dark:text-red-400';
    if (budget.utilization > budget.alertThreshold) return 'text-yellow-600 dark:text-yellow-400';
    return 'text-green-600 dark:text-green-400';
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
                Delete Budget
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

        {/* Budget Summary */}
        <div className="mb-6 p-4 bg-gray-50 dark:bg-gray-700 rounded-xl">
          <div className="flex items-center space-x-3 mb-3">
            <Target className="w-5 h-5 text-blue-500" />
            <div>
              <h3 className="font-bold text-gray-900 dark:text-white">{budget.category}</h3>
              <p className="text-sm text-gray-600 dark:text-gray-400 capitalize">{budget.period} budget</p>
            </div>
          </div>
          
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div>
              <p className="text-gray-600 dark:text-gray-400">Budget Amount</p>
              <p className="font-semibold text-gray-900 dark:text-white">${budget.budgetAmount.toLocaleString()}</p>
            </div>
            <div>
              <p className="text-gray-600 dark:text-gray-400">Spent</p>
              <p className="font-semibold text-gray-900 dark:text-white">${budget.spentAmount.toLocaleString()}</p>
            </div>
            <div>
              <p className="text-gray-600 dark:text-gray-400">Utilization</p>
              <p className={`font-semibold ${getStatusColor()}`}>
                {budget.utilization.toFixed(1)}%
              </p>
            </div>
            <div>
              <p className="text-gray-600 dark:text-gray-400">Transactions</p>
              <p className="font-semibold text-gray-900 dark:text-white">{budget.transactionCount}</p>
            </div>
          </div>

          <div className="mt-3 pt-3 border-t border-gray-200 dark:border-gray-600">
            <div className="flex items-center space-x-2 text-xs text-gray-500 dark:text-gray-400">
              <Calendar className="w-3 h-3" />
              <span>{format(new Date(budget.startDate), 'MMM dd')} - {format(new Date(budget.endDate), 'MMM dd, yyyy')}</span>
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
                This will permanently remove this budget and all its tracking data. You'll lose all spending history and progress for this category.
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
                <span>Delete Budget</span>
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};