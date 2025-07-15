import { useState, useCallback } from 'react';
import { Investment } from '../types';
import { useLocalStorage } from './useLocalStorage';
import { mockInvestments } from '../services/mockData';
import toast from 'react-hot-toast';

export function useInvestments() {
  const [investments, setInvestments] = useLocalStorage<Investment[]>('investments', mockInvestments);
  const [loading, setLoading] = useState(false);

  const addInvestment = useCallback(async (investmentData: Omit<Investment, 'id'>) => {
    setLoading(true);
    try {
      // Validate required fields
      if (!investmentData.symbol?.trim()) {
        throw new Error('Symbol is required');
      }
      if (!investmentData.name?.trim()) {
        throw new Error('Investment name is required');
      }
      if (!investmentData.shares || investmentData.shares <= 0) {
        throw new Error('Shares must be greater than 0');
      }
      if (!investmentData.purchasePrice || investmentData.purchasePrice <= 0) {
        throw new Error('Purchase price must be greater than 0');
      }
      if (!investmentData.currentPrice || investmentData.currentPrice <= 0) {
        throw new Error('Current price must be greater than 0');
      }
      if (!investmentData.purchaseDate) {
        throw new Error('Purchase date is required');
      }
      if (new Date(investmentData.purchaseDate) > new Date()) {
        throw new Error('Purchase date cannot be in the future');
      }

      // Check for duplicate symbols
      const existingInvestment = investments.find(inv => 
        inv.symbol.toLowerCase() === investmentData.symbol.toLowerCase()
      );
      if (existingInvestment) {
        throw new Error(`An investment with symbol ${investmentData.symbol} already exists`);
      }

      const newInvestment: Investment = {
        ...investmentData,
        id: `investment_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
        symbol: investmentData.symbol.trim().toUpperCase(),
        name: investmentData.name.trim(),
        sector: investmentData.sector?.trim() || undefined,
      };
      
      setInvestments(prev => [newInvestment, ...prev]);
      toast.success('Investment added successfully');
      return newInvestment;
    } catch (error: any) {
      toast.error(error.message || 'Failed to add investment');
      throw error;
    } finally {
      setLoading(false);
    }
  }, [setInvestments, investments]);

  const updateInvestment = useCallback(async (id: string, investmentData: Partial<Investment>) => {
    setLoading(true);
    try {
      const existingInvestment = investments.find(inv => inv.id === id);
      if (!existingInvestment) {
        throw new Error('Investment not found');
      }

      // Validate updated data
      if (investmentData.shares !== undefined && investmentData.shares <= 0) {
        throw new Error('Shares must be greater than 0');
      }
      if (investmentData.purchasePrice !== undefined && investmentData.purchasePrice <= 0) {
        throw new Error('Purchase price must be greater than 0');
      }
      if (investmentData.currentPrice !== undefined && investmentData.currentPrice <= 0) {
        throw new Error('Current price must be greater than 0');
      }
      if (investmentData.purchaseDate && new Date(investmentData.purchaseDate) > new Date()) {
        throw new Error('Purchase date cannot be in the future');
      }

      // Check for duplicate symbols (excluding current investment)
      if (investmentData.symbol) {
        const duplicateInvestment = investments.find(inv => 
          inv.id !== id &&
          inv.symbol.toLowerCase() === investmentData.symbol!.toLowerCase()
        );
        if (duplicateInvestment) {
          throw new Error(`An investment with symbol ${investmentData.symbol} already exists`);
        }
      }

      setInvestments(prev => 
        prev.map(investment => 
          investment.id === id 
            ? { 
                ...investment, 
                ...investmentData,
                symbol: investmentData.symbol?.trim().toUpperCase() || investment.symbol,
                name: investmentData.name?.trim() || investment.name,
                sector: investmentData.sector?.trim() || investment.sector,
              }
            : investment
        )
      );
      toast.success('Investment updated successfully');
    } catch (error: any) {
      toast.error(error.message || 'Failed to update investment');
      throw error;
    } finally {
      setLoading(false);
    }
  }, [setInvestments, investments]);

  const deleteInvestment = useCallback(async (id: string) => {
    setLoading(true);
    try {
      const existingInvestment = investments.find(inv => inv.id === id);
      if (!existingInvestment) {
        throw new Error('Investment not found');
      }

      setInvestments(prev => prev.filter(investment => investment.id !== id));
      toast.success('Investment deleted successfully');
    } catch (error: any) {
      toast.error(error.message || 'Failed to delete investment');
      throw error;
    } finally {
      setLoading(false);
    }
  }, [setInvestments, investments]);

  const getInvestmentsByType = useCallback((type: Investment['type']) => {
    return investments.filter(investment => investment.type === type);
  }, [investments]);

  const getInvestmentsBySector = useCallback((sector: string) => {
    return investments.filter(investment => investment.sector === sector);
  }, [investments]);

  const getTotalValue = useCallback(() => {
    return investments.reduce((sum, inv) => sum + (inv.shares * inv.currentPrice), 0);
  }, [investments]);

  const getTotalGainLoss = useCallback(() => {
    const totalValue = getTotalValue();
    const totalCost = investments.reduce((sum, inv) => sum + (inv.shares * inv.purchasePrice), 0);
    return totalValue - totalCost;
  }, [investments, getTotalValue]);

  const getPortfolioPerformance = useCallback(() => {
    const totalValue = getTotalValue();
    const totalCost = investments.reduce((sum, inv) => sum + (inv.shares * inv.purchasePrice), 0);
    const gainLoss = totalValue - totalCost;
    const percentage = totalCost > 0 ? (gainLoss / totalCost) * 100 : 0;
    
    return {
      totalValue,
      totalCost,
      gainLoss,
      percentage
    };
  }, [investments, getTotalValue]);

  return {
    investments,
    loading,
    addInvestment,
    updateInvestment,
    deleteInvestment,
    getInvestmentsByType,
    getInvestmentsBySector,
    getTotalValue,
    getTotalGainLoss,
    getPortfolioPerformance,
  };
}