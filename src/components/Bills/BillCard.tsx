import React, { useState } from 'react';
import { Bill } from '../../types';
import { Calendar, DollarSign, AlertTriangle, CheckCircle, Clock, CreditCard, Edit, Trash2 } from 'lucide-react';
import { format, differenceInDays } from 'date-fns';
import { BillDeleteModal } from './BillDeleteModal';

interface BillCardProps {
  bill: Bill;
  onUpdate: (id: string, data: Partial<Bill>) => Promise<void>;
  onDelete: (id: string) => Promise<void>;
  onMarkAsPaid: (id: string) => Promise<void>;
  onMarkAsUnpaid: (id: string) => Promise<void>;
}

export const BillCard: React.FC<BillCardProps> = ({ 
  bill, 
  onUpdate, 
  onDelete, 
  onMarkAsPaid, 
  onMarkAsUnpaid 
}) => {
  const [loading, setLoading] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  
  const daysUntilDue = differenceInDays(new Date(bill.dueDate), new Date());
  const isOverdue = daysUntilDue < 0;
  const isDueSoon = daysUntilDue <= 3 && daysUntilDue >= 0;

  const getStatusColor = () => {
    if (bill.isPaid) return 'from-green-50 to-green-100 dark:from-green-900/20 dark:to-green-800/20 border-green-200 dark:border-green-800';
    if (isOverdue) return 'from-red-50 to-red-100 dark:from-red-900/20 dark:to-red-800/20 border-red-200 dark:border-red-800';
    if (isDueSoon) return 'from-yellow-50 to-yellow-100 dark:from-yellow-900/20 dark:to-yellow-800/20 border-yellow-200 dark:border-yellow-800';
    return 'from-blue-50 to-blue-100 dark:from-blue-900/20 dark:to-blue-800/20 border-blue-200 dark:border-blue-800';
  };

  const getStatusIcon = () => {
    if (bill.isPaid) return <CheckCircle className="w-5 h-5 text-green-500" />;
    if (isOverdue) return <AlertTriangle className="w-5 h-5 text-red-500" />;
    if (isDueSoon) return <Clock className="w-5 h-5 text-yellow-500" />;
    return <Calendar className="w-5 h-5 text-blue-500" />;
  };

  const getStatusText = () => {
    if (bill.isPaid) return 'Paid';
    if (isOverdue) return `${Math.abs(daysUntilDue)} days overdue`;
    if (isDueSoon) return `Due in ${daysUntilDue} day${daysUntilDue === 1 ? '' : 's'}`;
    return `Due in ${daysUntilDue} days`;
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

  const handleTogglePaid = async () => {
    setLoading(true);
    try {
      if (bill.isPaid) {
        await onMarkAsUnpaid(bill.id);
      } else {
        await onMarkAsPaid(bill.id);
      }
    } catch (error) {
      console.error('Failed to toggle bill status:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = () => {
    setShowDeleteModal(true);
  };

  const handleDeleteConfirm = async () => {
    await onDelete(bill.id);
    setShowDeleteModal(false);
  };

  return (
    <>
      <div className={`bg-gradient-to-br ${getStatusColor()} rounded-2xl p-6 border-2 transition-all duration-300 hover:shadow-xl hover:scale-[1.02] group`}>
        {/* Header */}
        <div className="flex items-start justify-between mb-4">
          <div className="flex items-center space-x-3">
            <div className="text-2xl">{getCategoryIcon()}</div>
            <div>
              <h3 className="text-lg font-bold text-gray-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                {bill.name}
              </h3>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                {bill.category}
              </p>
            </div>
          </div>
          <div className="flex items-center space-x-2">
            {getStatusIcon()}
            <div className="opacity-0 group-hover:opacity-100 transition-opacity flex space-x-1">
              <button
                onClick={handleDelete}
                disabled={loading}
                className="p-1 text-gray-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 rounded transition-colors disabled:opacity-50"
                title="Delete bill"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>

        {/* Amount */}
        <div className="mb-4">
          <div className="flex items-center space-x-2 mb-2">
            <DollarSign className="w-5 h-5 text-gray-500" />
            <span className="text-2xl font-bold text-gray-900 dark:text-white">
              ${bill.amount.toLocaleString()}
            </span>
          </div>
          {bill.isRecurring && bill.frequency && (
            <span className="inline-block px-2 py-1 bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-400 text-xs rounded-full">
              {bill.frequency} recurring
            </span>
          )}
        </div>

        {/* Due Date */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <Calendar className="w-4 h-4 text-gray-500" />
              <span className="text-sm text-gray-600 dark:text-gray-400">
                Due: {format(new Date(bill.dueDate), 'MMM dd, yyyy')}
              </span>
            </div>
            <span className={`text-sm font-medium ${
              bill.isPaid 
                ? 'text-green-600 dark:text-green-400'
                : isOverdue
                ? 'text-red-600 dark:text-red-400'
                : isDueSoon
                ? 'text-yellow-600 dark:text-yellow-400'
                : 'text-blue-600 dark:text-blue-400'
            }`}>
              {getStatusText()}
            </span>
          </div>

          {/* Payment Method */}
          {bill.paymentMethod && (
            <div className="flex items-center space-x-2">
              <CreditCard className="w-4 h-4 text-gray-500" />
              <span className="text-sm text-gray-600 dark:text-gray-400">
                {bill.paymentMethod}
              </span>
            </div>
          )}

          {/* Notes */}
          {bill.notes && (
            <p className="text-sm text-gray-600 dark:text-gray-400 bg-white/50 dark:bg-gray-800/50 rounded-lg p-2">
              {bill.notes}
            </p>
          )}
        </div>

        {/* Action Button */}
        <div className="mt-4 pt-4 border-t border-gray-200 dark:border-gray-700">
          <button 
            onClick={handleTogglePaid}
            disabled={loading}
            className={`w-full py-2 px-4 rounded-lg font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-2 ${
              bill.isPaid
                ? 'bg-gray-500 hover:bg-gray-600 text-white'
                : isOverdue
                ? 'bg-red-500 hover:bg-red-600 text-white'
                : isDueSoon
                ? 'bg-yellow-500 hover:bg-yellow-600 text-white'
                : 'bg-blue-500 hover:bg-blue-600 text-white'
            }`}
          >
            {loading ? (
              <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
            ) : (
              <>
                {bill.isPaid ? (
                  <>
                    <Clock className="w-4 h-4" />
                    <span>Mark as Unpaid</span>
                  </>
                ) : (
                  <>
                    <CheckCircle className="w-4 h-4" />
                    <span>Mark as Paid</span>
                  </>
                )}
              </>
            )}
          </button>
        </div>
      </div>

      {/* Delete Modal */}
      {showDeleteModal && (
        <BillDeleteModal
          bill={bill}
          onDeleteBill={handleDeleteConfirm}
          onClose={() => setShowDeleteModal(false)}
        />
      )}
    </>
  );
};