import React from 'react';
import { Transaction } from '../../types';
import { format } from 'date-fns';
import { useCurrency } from '../../contexts/CurrencyContext';

interface RecentTransactionsProps {
  transactions: Transaction[];
}

export const RecentTransactions: React.FC<RecentTransactionsProps> = ({ transactions }) => {
  const { formatCurrency } = useCurrency();
  
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
    <div className="bg-white dark:bg-gray-800 rounded-xl p-4 sm:p-6 shadow-sm border border-gray-200 dark:border-gray-700">
      <h3 className="text-base sm:text-lg font-semibold text-gray-900 dark:text-white mb-4">
        Recent Transactions
      </h3>
      <div className="space-y-3 sm:space-y-4">
        {transactions.slice(0, 5).map((transaction) => (
          <div
            key={transaction.id}
            className="flex items-center justify-between py-2 sm:py-3 border-b border-gray-100 dark:border-gray-700 last:border-0"
          >
            <div className="flex-1 min-w-0 pr-2">
              <div className="flex flex-col sm:flex-row sm:items-center sm:space-x-3">
                <span className={`px-2 py-1 rounded-full text-xs font-medium ${getCategoryColor(transaction.category)} mb-1 sm:mb-0 inline-block sm:inline`}>
                  {transaction.category}
                </span>
                <p className="font-medium text-gray-900 dark:text-white truncate text-sm sm:text-base">
                  {transaction.description}
                </p>
              </div>
              <p className="text-xs sm:text-sm text-gray-500 dark:text-gray-400 mt-1">
                {format(new Date(transaction.date), 'MMM dd, yyyy')}
              </p>
            </div>
            <div className="text-right ml-4">
              <p className={`font-semibold whitespace-nowrap text-sm sm:text-base ${
                transaction.type === 'income' 
                  ? 'text-green-600 dark:text-green-400' 
                  : 'text-red-600 dark:text-red-400'
              }`}>
                {transaction.type === 'income' ? '+' : '-'}{formatCurrency(transaction.amount)}
              </p>
            </div>
          </div>
        ))}
        
        {transactions.length === 0 && (
          <div className="text-center py-6">
            <p className="text-gray-500 dark:text-gray-400">No transactions found</p>
            <p className="text-xs text-gray-400 dark:text-gray-500 mt-1">
              Add your first transaction to get started
            </p>
          </div>
        )}
      </div>
    </div>
  );
};