import React, { useState } from 'react';
import { Bill } from '../../types';
import { X, Trash2, AlertTriangle, Calendar, DollarSign, CreditCard } from 'lucide-react';
import { format, differenceInDays } from 'date-fns';

interface BillDeleteModalProps {
  bill: Bill;
  onDeleteBill: () => Promise<void>;
  onClose: () => void;
}

export const BillDeleteModal: React.FC<BillDeleteModalProps> = ({ 
  bill, 
  onDeleteBill, 
  onClose 
}) => {
  const [loading, setLoading] = useState(false);
  const [confirmText, setConfirmText] = useState('');

  const confirmationText = bill.name;
  const daysUntilDue = differenceInDays(new Date(bill.dueDate), new Date());
  const isOverdue = daysUntilDue < 0;
  const isDueSoon = daysUntilDue <= 3 && daysUntilDue >= 0;

  const handleDelete = async () => {
    if (confirmText !== confirmationText) {
      return;
    }

    setLoading(true);
    try {
      await onDeleteBill();
      onClose();
    } catch (error) {
      console.error('Failed to delete bill:', error);
    } finally {
      setLoading(false);
    }
  };

  const getCategoryIcon = () => {
    switch (bill.category.toLowerCase()) {
      case 'housing': return '🏠';
      case 'utilities': return '⚡';
      case 'insurance': return '🛡️';
      case 'subscriptions': return '📱';
      case 'loans': return '🏦';
      default: return '📄';
    }
  };

  const getStatusColor = () => {
    if (bill.isPaid) return 'text-green-600 dark:text-green-400';
    if (isOverdue) return 'text-red-600 dark:text-red-400';
    if (isDueSoon) return 'text-yellow-600 dark:text-yellow-400';
    return 'text-blue-600 dark:text-blue-400';
  };

  const getStatusText = () => {
    if (bill.isPaid) return 'Paid';
    if (isOverdue) return `${Math.abs(daysUntilDue)} days overdue`;
    if (isDueSoon) return `Due in ${daysUntilDue} day${daysUntilDue === 1 ? '' : 's'}`;
    return `Due in ${daysUntilDue} days`;
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
                Delete Bill
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

        {/* Bill Summary */}
        <div className="mb-6 p-4 bg-gray-50 dark:bg-gray-700 rounded-xl">
          <div className="flex items-center space-x-3 mb-3">
            <div className="text-2xl">{getCategoryIcon()}</div>
            <div>
              <h3 className="font-bold text-gray-900 dark:text-white">{bill.name}</h3>
              <p className="text-sm text-gray-600 dark:text-gray-400">{bill.category}</p>
            </div>
          </div>
          
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div>
              <p className="text-gray-600 dark:text-gray-400">Amount</p>
              <p className="font-semibold text-gray-900 dark:text-white">${bill.amount.toLocaleString()}</p>
            </div>
            <div>
              <p className="text-gray-600 dark:text-gray-400">Status</p>
              <p className={`font-semibold ${getStatusColor()}`}>
                {getStatusText()}
              </p>
            </div>
            <div>
              <p className="text-gray-600 dark:text-gray-400">Due Date</p>
              <p className="font-semibold text-gray-900 dark:text-white">
                {format(new Date(bill.dueDate), 'MMM dd, yyyy')}
              </p>
            </div>
            <div>
              <p className="text-gray-600 dark:text-gray-400">Frequency</p>
              <p className="font-semibold text-gray-900 dark:text-white">
                {bill.isRecurring ? bill.frequency || 'Monthly' : 'One-time'}
              </p>
            </div>
          </div>

          {bill.paymentMethod && (
            <div className="mt-3 pt-3 border-t border-gray-200 dark:border-gray-600">
              <div className="flex items-center space-x-2 text-sm">
                <CreditCard className="w-4 h-4 text-gray-500" />
                <span className="text-gray-600 dark:text-gray-400">Payment Method:</span>
                <span className="font-medium text-gray-900 dark:text-white">{bill.paymentMethod}</span>
              </div>
            </div>
          )}

          {bill.notes && (
            <div className="mt-3">
              <p className="text-xs text-gray-600 dark:text-gray-400 bg-gray-100 dark:bg-gray-600 p-2 rounded">
                {bill.notes}
              </p>
            </div>
          )}
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
                This will permanently remove this bill reminder and all its history. 
                {bill.isRecurring && " You'll lose all recurring payment tracking for this bill."}
                {!bill.isPaid && isOverdue && " This bill is currently overdue!"}
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
                <span>Delete Bill</span>
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};