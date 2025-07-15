import { useState, useCallback } from 'react';
import { Goal } from '../types';
import { useLocalStorage } from './useLocalStorage';
import { mockGoals } from '../services/mockData';
import toast from 'react-hot-toast';

export function useGoals() {
  const [goals, setGoals] = useLocalStorage<Goal[]>('goals', mockGoals);
  const [loading, setLoading] = useState(false);

  const addGoal = useCallback(async (goalData: Omit<Goal, 'id' | 'createdAt'>) => {
    setLoading(true);
    try {
      // Validate required fields
      if (!goalData.title?.trim()) {
        throw new Error('Goal title is required');
      }
      if (!goalData.description?.trim()) {
        throw new Error('Goal description is required');
      }
      if (!goalData.targetAmount || goalData.targetAmount <= 0) {
        throw new Error('Target amount must be greater than 0');
      }
      if (goalData.currentAmount < 0) {
        throw new Error('Current amount cannot be negative');
      }
      if (!goalData.targetDate) {
        throw new Error('Target date is required');
      }
      if (new Date(goalData.targetDate) <= new Date()) {
        throw new Error('Target date must be in the future');
      }

      // Check for duplicate goal titles
      const existingGoal = goals.find(goal => 
        goal.title.toLowerCase().trim() === goalData.title.toLowerCase().trim() && goal.isActive
      );
      if (existingGoal) {
        throw new Error('A goal with this title already exists');
      }

      const newGoal: Goal = {
        ...goalData,
        id: `goal_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
        title: goalData.title.trim(),
        description: goalData.description.trim(),
        currentAmount: Math.max(0, goalData.currentAmount || 0),
        createdAt: new Date().toISOString().split('T')[0],
      };
      
      setGoals(prev => [newGoal, ...prev]);
      toast.success('Goal created successfully');
      return newGoal;
    } catch (error: any) {
      toast.error(error.message || 'Failed to create goal');
      throw error;
    } finally {
      setLoading(false);
    }
  }, [setGoals, goals]);

  const updateGoal = useCallback(async (id: string, goalData: Partial<Goal>) => {
    setLoading(true);
    try {
      const existingGoal = goals.find(g => g.id === id);
      if (!existingGoal) {
        throw new Error('Goal not found');
      }

      // Validate updated data
      if (goalData.title !== undefined && !goalData.title.trim()) {
        throw new Error('Goal title cannot be empty');
      }
      if (goalData.description !== undefined && !goalData.description.trim()) {
        throw new Error('Goal description cannot be empty');
      }
      if (goalData.targetAmount !== undefined && goalData.targetAmount <= 0) {
        throw new Error('Target amount must be greater than 0');
      }
      if (goalData.currentAmount !== undefined && goalData.currentAmount < 0) {
        throw new Error('Current amount cannot be negative');
      }
      if (goalData.targetDate && new Date(goalData.targetDate) <= new Date()) {
        throw new Error('Target date must be in the future');
      }

      // Check for duplicate titles (excluding current goal)
      if (goalData.title) {
        const duplicateGoal = goals.find(goal => 
          goal.id !== id &&
          goal.title.toLowerCase().trim() === goalData.title!.toLowerCase().trim() && 
          goal.isActive
        );
        if (duplicateGoal) {
          throw new Error('A goal with this title already exists');
        }
      }

      setGoals(prev => 
        prev.map(goal => 
          goal.id === id 
            ? { 
                ...goal, 
                ...goalData,
                title: goalData.title?.trim() || goal.title,
                description: goalData.description?.trim() || goal.description,
                currentAmount: goalData.currentAmount !== undefined ? Math.max(0, goalData.currentAmount) : goal.currentAmount,
              }
            : goal
        )
      );
      toast.success('Goal updated successfully');
    } catch (error: any) {
      toast.error(error.message || 'Failed to update goal');
      throw error;
    } finally {
      setLoading(false);
    }
  }, [setGoals, goals]);

  const deleteGoal = useCallback(async (id: string) => {
    setLoading(true);
    try {
      const existingGoal = goals.find(g => g.id === id);
      if (!existingGoal) {
        throw new Error('Goal not found');
      }

      setGoals(prev => prev.filter(goal => goal.id !== id));
      toast.success('Goal deleted successfully');
    } catch (error: any) {
      toast.error(error.message || 'Failed to delete goal');
      throw error;
    } finally {
      setLoading(false);
    }
  }, [setGoals, goals]);

  const updateGoalProgress = useCallback(async (id: string, amount: number) => {
    setLoading(true);
    try {
      const existingGoal = goals.find(g => g.id === id);
      if (!existingGoal) {
        throw new Error('Goal not found');
      }

      if (amount === 0) {
        throw new Error('Amount cannot be zero');
      }

      const newAmount = Math.max(0, existingGoal.currentAmount + amount);
      
      setGoals(prev => 
        prev.map(goal => 
          goal.id === id 
            ? { ...goal, currentAmount: newAmount }
            : goal
        )
      );

      const actionText = amount > 0 ? 'added to' : 'subtracted from';
      toast.success(`$${Math.abs(amount).toFixed(2)} ${actionText} goal progress`);

      // Check if goal is completed
      if (newAmount >= existingGoal.targetAmount && existingGoal.currentAmount < existingGoal.targetAmount) {
        setTimeout(() => {
          toast.success(`🎉 Congratulations! You've reached your "${existingGoal.title}" goal!`, {
            duration: 6000,
          });
        }, 500);
      }
    } catch (error: any) {
      toast.error(error.message || 'Failed to update goal progress');
      throw error;
    } finally {
      setLoading(false);
    }
  }, [setGoals, goals]);

  const getActiveGoals = useCallback(() => {
    return goals.filter(goal => goal.isActive);
  }, [goals]);

  const getCompletedGoals = useCallback(() => {
    return goals.filter(goal => goal.currentAmount >= goal.targetAmount);
  }, [goals]);

  const getGoalProgress = useCallback((goalId: string) => {
    const goal = goals.find(g => g.id === goalId);
    if (!goal) return 0;
    return goal.targetAmount > 0 ? (goal.currentAmount / goal.targetAmount) * 100 : 0;
  }, [goals]);

  const getGoalsByCategory = useCallback((category: Goal['category']) => {
    return goals.filter(goal => goal.category === category);
  }, [goals]);

  const getGoalsByPriority = useCallback((priority: Goal['priority']) => {
    return goals.filter(goal => goal.priority === priority);
  }, [goals]);

  return {
    goals,
    loading,
    addGoal,
    updateGoal,
    deleteGoal,
    updateGoalProgress,
    getActiveGoals,
    getCompletedGoals,
    getGoalProgress,
    getGoalsByCategory,
    getGoalsByPriority,
  };
}