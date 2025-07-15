import { useState, useCallback } from 'react';
import { Transaction } from '../types';
import { useLocalStorage } from './useLocalStorage';
import { mockTransactions } from '../services/mockData';
import toast from 'react-hot-toast';

export function useTransactions() {
  const [transactions, setTransactions] = useLocalStorage<Transaction[]>('transactions', mockTransactions);
  const [loading, setLoading] = useState(false);

  const addTransaction = useCallback(async (transactionData: Omit<Transaction, 'id'>) => {
    setLoading(true);
    try {
      // Validate required fields
      if (!transactionData.amount || transactionData.amount <= 0) {
        throw new Error('Amount must be greater than 0');
      }
      if (!transactionData.description?.trim()) {
        throw new Error('Description is required');
      }
      if (!transactionData.category) {
        throw new Error('Category is required');
      }
      if (!transactionData.date) {
        throw new Error('Date is required');
      }

      const newTransaction: Transaction = {
        ...transactionData,
        id: `transaction_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
        description: transactionData.description.trim(),
        merchant: transactionData.merchant?.trim() || undefined,
        location: transactionData.location?.trim() || undefined,
        notes: transactionData.notes?.trim() || undefined,
      };
      
      setTransactions(prev => [newTransaction, ...prev]);
      toast.success('Transaction added successfully');
      return newTransaction;
    } catch (error: any) {
      toast.error(error.message || 'Failed to add transaction');
      throw error;
    } finally {
      setLoading(false);
    }
  }, [setTransactions]);

  const updateTransaction = useCallback(async (id: string, transactionData: Partial<Transaction>) => {
    setLoading(true);
    try {
      // Validate if transaction exists
      const existingTransaction = transactions.find(t => t.id === id);
      if (!existingTransaction) {
        throw new Error('Transaction not found');
      }

      // Validate updated data
      if (transactionData.amount !== undefined && transactionData.amount <= 0) {
        throw new Error('Amount must be greater than 0');
      }
      if (transactionData.description !== undefined && !transactionData.description.trim()) {
        throw new Error('Description cannot be empty');
      }

      setTransactions(prev => 
        prev.map(transaction => 
          transaction.id === id 
            ? { 
                ...transaction, 
                ...transactionData,
                description: transactionData.description?.trim() || transaction.description,
                merchant: transactionData.merchant?.trim() || transaction.merchant,
                location: transactionData.location?.trim() || transaction.location,
                notes: transactionData.notes?.trim() || transaction.notes,
              }
            : transaction
        )
      );
      toast.success('Transaction updated successfully');
    } catch (error: any) {
      toast.error(error.message || 'Failed to update transaction');
      throw error;
    } finally {
      setLoading(false);
    }
  }, [setTransactions, transactions]);

  const deleteTransaction = useCallback(async (id: string) => {
    setLoading(true);
    try {
      const existingTransaction = transactions.find(t => t.id === id);
      if (!existingTransaction) {
        throw new Error('Transaction not found');
      }

      setTransactions(prev => prev.filter(transaction => transaction.id !== id));
      toast.success('Transaction deleted successfully');
    } catch (error: any) {
      toast.error(error.message || 'Failed to delete transaction');
      throw error;
    } finally {
      setLoading(false);
    }
  }, [setTransactions, transactions]);

  const getTransactionsByCategory = useCallback((category: string) => {
    return transactions.filter(transaction => transaction.category === category);
  }, [transactions]);

  const getTransactionsByDateRange = useCallback((startDate: string, endDate: string) => {
    return transactions.filter(transaction => 
      transaction.date >= startDate && transaction.date <= endDate
    );
  }, [transactions]);

  const getTransactionsByType = useCallback((type: 'income' | 'expense') => {
    return transactions.filter(transaction => transaction.type === type);
  }, [transactions]);

  const getTotalByType = useCallback((type: 'income' | 'expense') => {
    return transactions
      .filter(transaction => transaction.type === type)
      .reduce((sum, transaction) => sum + transaction.amount, 0);
  }, [transactions]);

  const getMonthlyTransactions = useCallback((year: number, month: number) => {
    const startDate = `${year}-${String(month).padStart(2, '0')}-01`;
    const endDate = `${year}-${String(month).padStart(2, '0')}-31`;
    return getTransactionsByDateRange(startDate, endDate);
  }, [getTransactionsByDateRange]);

  return {
    transactions,
    loading,
    addTransaction,
    updateTransaction,
    deleteTransaction,
    getTransactionsByCategory,
    getTransactionsByDateRange,
    getTransactionsByType,
    getTotalByType,
    getMonthlyTransactions,
  };
}