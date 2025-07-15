import React, { useState } from 'react';
import { Transaction } from '../../types';
import { X, Trash2, AlertTriangle, DollarSign, Calendar } from 'lucide-react';
import { format } from 'date-fns';

interface TransactionDeleteModalProps {
  transaction: Transaction;
  onDeleteTransaction: () => Promise<void>;
  onClose: () => void;
}

export const TransactionDeleteModal: React.FC<TransactionDeleteModalProps> = ({ 
  transaction, 
  onDeleteTransaction, 
  onClose 
}) => {
  const [loading, setLoading] = useState(false);
  const [confirmText, setConfirmText] = useState('');

  const confirmationText = 'DELETE';

  const handleDelete = async () => {
    if (confirmText !== confirmationText) {
      return;
    }

    setLoading(true);
    try {
      await onDeleteTransaction();
      onClose();
    } catch (error) {
      console.error('Failed to delete transaction:', error);
    } finally {
      setLoading(false);
    }
  };

  const getCategoryColor = (category: string) => {
    const colors: Record<string, string> = {
      'Groceries': 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300',
      'Entertainment': 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-300',
      'Transportation': 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300',
      'Shopping': 'bg-pink-100 text-pink-800 dark:bg-pink-900 dark:text-pink-300',
      'Dining Out': 'bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-300',
      'Utilities': 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-300',
      'Salary': 'bg-emerald-100 text-emerald-800 dark:bg-emerald-900 dark:text-emerald-300',
      'Rent': 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300',
    };
    return colors[category] || 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-300';
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
                Delete Transaction
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

        {/* Transaction Summary */}
        <div className="mb-6 p-4 bg-gray-50 dark:bg-gray-700 rounded-xl">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center space-x-3">
              <DollarSign className="w-5 h-5 text-gray-500" />
              <span className={`text-lg font-bold ${
                transaction.type === 'income' ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'
              }`}>
                {transaction.type === 'income' ? '+' : '-'}${transaction.amount.toFixed(2)}
              </span>
            </div>
            <span className={`px-3 py-1 rounded-full text-xs font-medium ${getCategoryColor(transaction.category)}`}>
              {transaction.category}
            </span>
          </div>
          
          <div className="space-y-2 text-sm">
            <div>
              <p className="font-medium text-gray-900 dark:text-white">{transaction.description}</p>
              {transaction.merchant && (
                <p className="text-gray-600 dark:text-gray-400">{transaction.merchant}</p>
              )}
            </div>
            <div className="flex items-center space-x-2 text-gray-500 dark:text-gray-400">
              <Calendar className="w-4 h-4" />
              <span>{format(new Date(transaction.date), 'MMM dd, yyyy')}</span>
            </div>
            {transaction.notes && (
              <p className="text-gray-600 dark:text-gray-400 text-xs bg-gray-100 dark:bg-gray-600 p-2 rounded">
                {transaction.notes}
              </p>
            )}
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
                This transaction will be permanently removed from your records. This action cannot be undone.
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
                <span>Delete Transaction</span>
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};