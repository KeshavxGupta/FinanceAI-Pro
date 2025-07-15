import { useState, useCallback } from 'react';
import { Budget } from '../types';
import { useLocalStorage } from './useLocalStorage';
import { mockBudgets } from '../services/mockData';
import toast from 'react-hot-toast';

export function useBudgets() {
  const [budgets, setBudgets] = useLocalStorage<Budget[]>('budgets', mockBudgets);
  const [loading, setLoading] = useState(false);

  const addBudget = useCallback(async (budgetData: Omit<Budget, 'id'>) => {
    setLoading(true);
    try {
      // Validate required fields
      if (!budgetData.category?.trim()) {
        throw new Error('Category is required');
      }
      if (!budgetData.budgetAmount || budgetData.budgetAmount <= 0) {
        throw new Error('Budget amount must be greater than 0');
      }
      if (!budgetData.startDate) {
        throw new Error('Start date is required');
      }
      if (!budgetData.endDate) {
        throw new Error('End date is required');
      }
      if (new Date(budgetData.startDate) >= new Date(budgetData.endDate)) {
        throw new Error('End date must be after start date');
      }

      // Check for duplicate category in the same period
      const existingBudget = budgets.find(budget => 
        budget.category.toLowerCase() === budgetData.category.toLowerCase() &&
        budget.period === budgetData.period &&
        (
          (budgetData.startDate >= budget.startDate && budgetData.startDate <= budget.endDate) ||
          (budgetData.endDate >= budget.startDate && budgetData.endDate <= budget.endDate) ||
          (budgetData.startDate <= budget.startDate && budgetData.endDate >= budget.endDate)
        )
      );

      if (existingBudget) {
        throw new Error(`A budget for ${budgetData.category} already exists for this period`);
      }

      const newBudget: Budget = {
        ...budgetData,
        id: `budget_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
        category: budgetData.category.trim(),
        spentAmount: budgetData.spentAmount || 0,
        alertThreshold: Math.max(1, Math.min(100, budgetData.alertThreshold || 80)),
      };
      
      setBudgets(prev => [newBudget, ...prev]);
      toast.success('Budget created successfully');
      return newBudget;
    } catch (error: any) {
      toast.error(error.message || 'Failed to create budget');
      throw error;
    } finally {
      setLoading(false);
    }
  }, [setBudgets, budgets]);

  const updateBudget = useCallback(async (id: string, budgetData: Partial<Budget>) => {
    setLoading(true);
    try {
      const existingBudget = budgets.find(b => b.id === id);
      if (!existingBudget) {
        throw new Error('Budget not found');
      }

      // Validate updated data
      if (budgetData.budgetAmount !== undefined && budgetData.budgetAmount <= 0) {
        throw new Error('Budget amount must be greater than 0');
      }
      if (budgetData.category !== undefined && !budgetData.category.trim()) {
        throw new Error('Category cannot be empty');
      }
      if (budgetData.alertThreshold !== undefined) {
        budgetData.alertThreshold = Math.max(1, Math.min(100, budgetData.alertThreshold));
      }
      if (budgetData.startDate && budgetData.endDate && new Date(budgetData.startDate) >= new Date(budgetData.endDate)) {
        throw new Error('End date must be after start date');
      }

      setBudgets(prev => 
        prev.map(budget => 
          budget.id === id 
            ? { 
                ...budget, 
                ...budgetData,
                category: budgetData.category?.trim() || budget.category,
              }
            : budget
        )
      );
      toast.success('Budget updated successfully');
    } catch (error: any) {
      toast.error(error.message || 'Failed to update budget');
      throw error;
    } finally {
      setLoading(false);
    }
  }, [setBudgets, budgets]);

  const deleteBudget = useCallback(async (id: string) => {
    setLoading(true);
    try {
      const existingBudget = budgets.find(b => b.id === id);
      if (!existingBudget) {
        throw new Error('Budget not found');
      }

      setBudgets(prev => prev.filter(budget => budget.id !== id));
      toast.success('Budget deleted successfully');
    } catch (error: any) {
      toast.error(error.message || 'Failed to delete budget');
      throw error;
    } finally {
      setLoading(false);
    }
  }, [setBudgets, budgets]);

  const getBudgetByCategory = useCallback((category: string) => {
    return budgets.find(budget => budget.category.toLowerCase() === category.toLowerCase());
  }, [budgets]);

  const getActiveBudgets = useCallback(() => {
    const now = new Date().toISOString().split('T')[0];
    return budgets.filter(budget => budget.startDate <= now && budget.endDate >= now);
  }, [budgets]);

  const getBudgetUtilization = useCallback((budgetId: string) => {
    const budget = budgets.find(b => b.id === budgetId);
    if (!budget) return 0;
    return budget.budgetAmount > 0 ? (budget.spentAmount / budget.budgetAmount) * 100 : 0;
  }, [budgets]);

  return {
    budgets,
    loading,
    addBudget,
    updateBudget,
    deleteBudget,
    getBudgetByCategory,
    getActiveBudgets,
    getBudgetUtilization,
  };
}